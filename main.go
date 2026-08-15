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
	Name       StringValue  `json:"name"`
	Grade      IntegerValue `json:"grade"`
	Id         StringValue  `json:"id"`
	SetterName StringValue  `json:"setterName"`
}

// AUTHORIZATION

type AuthorizedUser struct {
	IdToken string `json:"idToken"`
}

// EXTRA

type StatUser struct {
	Name  string
	Score int
}

// https://firestore.googleapis.com/v1/projects/kaus-wall/databases/(default)/documents/gyms/JPXJQA5vb2WUQVt94MbD/walls/jK6Z5u60pFoXeVSZ9m15/problems

func main() {
	authToken := "Bearer " + GetAuthToken(os.Getenv("LEKAOS_EMAIL"), os.Getenv("LEKAOS_PASSWORD"), os.Getenv("LEKAOS_APITOKEN"))
	users := GetAllUsers(authToken)
	problems := GetAllProblemsFromWall(authToken, "JPXJQA5vb2WUQVt94MbD", "jK6Z5u60pFoXeVSZ9m15")

	problemMap := make(map[string]string)
	userList := make([]StatUser, len(users))

	for _, problemDoc := range problems {
		problemMap[problemDoc.Fields.Id.Value] = problemDoc.Fields.Grade.Value
	}

	for i, userDoc := range users {
		score := 0

		for problemId := range userDoc.Fields.Problems.Problems.Fields {
			if _, ok := problemMap[problemId]; ok {
				score += 1
			}
		}
		userList[i] = StatUser{
			Name:  userDoc.Fields.Name.Value,
			Score: score,
		}
	}

	slices.SortFunc(userList, func(a, b StatUser) int {
		return cmp.Compare(b.Score, a.Score)
	})

	f, err := os.Create("./ranking.json")

	if err != nil {
		panic(err)
	}

	defer f.Close()

	jsonStr, err := json.Marshal(userList)

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
