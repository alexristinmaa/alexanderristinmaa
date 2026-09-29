package main

import (
	"bytes"
	"cmp"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"slices"
	"time"

	_ "github.com/joho/godotenv/autoload"
)

// FIREBASE NATIVES

type IntegerValue struct {
	Value string `json:"integerValue"`
}

type StringValue struct {
	Value string `json:"stringValue"`
}

type MapValue[E any] struct {
	Fields map[string]E `json:"fields"`
}

type TimestampValue struct {
	Value string `json:"timestampValue"`
}

type Collection[T any] struct {
	Documents     []T    `json:"documents"`
	NextPageToken string `json:"nextPageToken"`
}

// USERS

type UsersCollection struct {
	Documents     []UserDocument `json:"documents"`
	NextPageToken string         `json:"nextPageToken"`
}

type UserDocument struct {
	Name   string `json:"name"`
	Fields User   `json:"fields"`
}

type User struct {
	Name     StringValue  `json:"name"`
	Uid      StringValue  `json:"uid"`
	Problems SentProblems `json:"problems"`
}

type SentProblems struct {
	Problems MapValue[StringValue] `json:"mapValue"`
}

// PROBLEMS

type ProblemsCollection struct {
	Documents     []ProblemDocument `json:"documents"`
	NextPageToken string            `json:"nextPageToken"`
}

type ProblemDocument struct {
	Name   string  `json:"name"`
	Fields Problem `json:"fields"`
}

type Problem struct {
	Name         StringValue    `json:"name"`
	Grade        IntegerValue   `json:"grade"`
	Id           StringValue    `json:"id"`
	SetterName   StringValue    `json:"setterName"`
	CreationDate TimestampValue `json:"creationDate"`
}

// AUTHORIZATION

type AuthorizedUser struct {
	IdToken string `json:"idToken"`
}

// EXTRA

type StatUser struct {
	Name      string
	Weeks     map[string]StatWeek
	SendCount int
}

type StatSend struct {
	Date  string
	Grade string
}

type StatWeek struct {
	Count  int
	Grades []string
}

// https://firestore.googleapis.com/v1/projects/kaus-wall/databases/(default)/documents/gyms/JPXJQA5vb2WUQVt94MbD/walls/jK6Z5u60pFoXeVSZ9m15/problems

func main() {
	authToken := "Bearer " + GetAuthToken(os.Getenv("LEKAOS_EMAIL"), os.Getenv("LEKAOS_PASSWORD"), os.Getenv("LEKAOS_APITOKEN"))
	users := GetAllUsers(authToken)
	problems := GetAllProblemsFromWall(authToken, "JPXJQA5vb2WUQVt94MbD", "jK6Z5u60pFoXeVSZ9m15")

	problemMap := make(map[string]StatSend)
	userList := make([]StatUser, len(users))

	for _, problemDoc := range problems {
		problemMap[problemDoc.Fields.Id.Value] = StatSend{
			Date:  problemDoc.Fields.CreationDate.Value,
			Grade: problemDoc.Fields.Grade.Value,
		}
	}

	for i, userDoc := range users {
		sends := make(map[string]StatWeek)
		sendCount := 0

		for problemId := range userDoc.Fields.Problems.Problems.Fields {
			if problem, ok := problemMap[problemId]; ok {
				// Get the first day of this week, and if the sends map has the date,
				// add it to the date
				sendCount += 1

				date, err := time.Parse(time.RFC3339, problem.Date)

				if err != nil {
					panic(err)
				}

				normalizedDate := date.AddDate(0, 0, -int(date.Weekday())).Truncate(time.Hour * 24).Format("2006-01-02")

				if err != nil {
					panic(err)
				}

				if _, ok := sends[normalizedDate]; !ok {
					sends[normalizedDate] = StatWeek{
						Count:  0,
						Grades: []string{},
					}
				}

				previousStat := sends[normalizedDate]

				sends[normalizedDate] = StatWeek{
					Count:  previousStat.Count + 1,
					Grades: append(previousStat.Grades, problem.Grade),
				}
			}
		}

		userList[i] = StatUser{
			Name:      userDoc.Fields.Name.Value,
			Weeks:     sends,
			SendCount: sendCount,
		}
	}

	slices.SortFunc(userList, func(a, b StatUser) int {
		return cmp.Compare(b.SendCount, a.SendCount)
	})

	// Filter userList
	filteredStats := []StatUser{}

	for _, u := range userList {
		if u.SendCount == 0 {
			continue
		}

		filteredStats = append(filteredStats, u)
	}

	f, err := os.Create("./ranking.json")

	if err != nil {
		panic(err)
	}

	defer f.Close()

	jsonStr, err := json.Marshal(filteredStats)

	if err != nil {
		panic(err)
	}

	f.WriteString(string(jsonStr))
}

func GetAuthToken(email, password, apiToken string) string {
	// https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=APITOKEN
	url := fmt.Sprintf("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=%s", apiToken)
	reqBody := fmt.Sprintf(`
		{
			"email": "%s",
			"password": "%s",
			"returnSecureToken": true
		}
	`, email, password)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer([]byte(reqBody)))

	if err != nil {
		panic(err)
	}

	req.Header.Add("Content-Type", "Application/json")

	client := &http.Client{}

	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	var res AuthorizedUser
	err = json.Unmarshal([]byte(body), &res)

	if err != nil {
		panic(err)
	}

	return res.IdToken
}

func GetAllProblemsFromWall(authToken, gymId, wallId string) []ProblemDocument {
	url := fmt.Sprintf("https://firestore.googleapis.com/v1/projects/kaus-wall/databases/(default)/documents/gyms/%s/walls/%s/problems?pageSize=5000", gymId, wallId)
	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		panic(err)
	}

	req.Header.Add("Authorization", authToken)

	return getAllPages[ProblemDocument](req, "first")
}

func GetAllUsers(authToken string) []UserDocument {
	req, err := http.NewRequest("GET", "https://firestore.googleapis.com/v1/projects/kaus-wall/databases/(default)/documents/users?pageSize=5000", nil)

	if err != nil {
		panic(err)
	}

	req.Header.Add("Authorization", authToken)

	return getAllPages[UserDocument](req, "first")
}

func getAllPages[T any](req *http.Request, pageToken string) []T {
	if pageToken == "" {
		return []T{}
	}

	fmt.Println("Getting pageToken:", pageToken)

	if pageToken != "first" {
		req.URL.RawQuery = url.Values{
			"pageToken": {pageToken},
		}.Encode()
	}

	client := &http.Client{}

	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	var res Collection[T]
	err = json.Unmarshal([]byte(body), &res)

	if err != nil {
		panic(err)
	}

	return append(res.Documents, getAllPages[T](req, res.NextPageToken)...)
}
