package main

import (
	"cmp"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"slices"
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

// EXTRA

type StatUser struct {
	Name  string
	Score int
}

// https://firestore.googleapis.com/v1/projects/kaus-wall/databases/(default)/documents/gyms/JPXJQA5vb2WUQVt94MbD/walls/jK6Z5u60pFoXeVSZ9m15/problems
const authToken string = "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjIwY2FkODZkNzY5ZmFkZTViODkxNmQ5Y2U1MDc0YzgyMGYwNjdkNTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20va2F1cy13YWxsIiwiYXVkIjoia2F1cy13YWxsIiwiYXV0aF90aW1lIjoxNzg1ODU2Nzg1LCJ1c2VyX2lkIjoiM3pOYk5qcEtmbVZyY2lhcFAwMUZWTzFoQUQzMiIsInN1YiI6IjN6TmJOanBLZm1WcmNpYXBQMDFGVk8xaEFEMzIiLCJpYXQiOjE3ODU5NTk4MDYsImV4cCI6MTc4NTk2MzQwNiwiZW1haWwiOiJhbGV4LnJpc3Rpbm1hYUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYWxleC5yaXN0aW5tYWFAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.hJ03sKYIq1MXEaWNENwh8DdjCEtV2ZduSY_Ho2yd4DXIGwGzzMM7aFgG_O7oIUnvwAaYEMVEHroMO69EBfGWBeGcJJ0F7s1wM1KfjlYLYa-u4vsdVHTP-xYLmJCZLW7-RCdJdyuHPm8ctzTIgu1cyWVMnk0qjYGT6ACoO-yMpvEWB8jHPNNk84VjBVHKLBbFo4e7JayTlsjoAJ5ffrVkOdqSV9HNynrEpM9vtM8zKLaqrh6EUbnRlJXvoaUEI7xC8OJ95sy-b3CBwRBI5cXNYLrEQh2LYQxZaWJutPd29hrGV7cNX6cWgoSo8LfKC2eQxyIHl5-j52IVqJh7GGAdrQ"

func main() {
	users := GetAllUsers()
	problems := GetAllProblemsFromWall("JPXJQA5vb2WUQVt94MbD", "jK6Z5u60pFoXeVSZ9m15")

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

func GetAllProblemsFromWall(gymId, wallId string) []ProblemDocument {
	body, err := os.ReadFile("./problems.json")

	var problems []ProblemDocument
	err = json.Unmarshal(body, &problems)

	return problems

	url := fmt.Sprintf("https://firestore.googleapis.com/v1/projects/kaus-wall/databases/(default)/documents/gyms/%s/walls/%s/problems?pageSize=5000", gymId, wallId)
	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		panic(err)
	}

	req.Header.Add("Authorization", authToken)

	return getAllPages[ProblemDocument](req, "firstProblems")
}

func GetAllUsers() []UserDocument {
	body, err := os.ReadFile("./users.json")

	var users []UserDocument
	err = json.Unmarshal(body, &users)

	return users

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

	fmt.Println("Getting users, pageToken:", pageToken)

	if pageToken != "first" {
		req.URL.RawQuery = url.Values{
			"pageToken": {pageToken},
		}.Encode()
	} else if pageToken == "" {

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
