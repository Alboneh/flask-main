package db

import (
	"fmt"
	"log"

	// Sqlx
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var (
	// Sqlx
	Client *sqlx.DB

	// conf
	username string
	password string
	host     string
	db       string
	Schema   string
	port     string
)

func init() {
	var err error

	// passport
	username = "root"
	password = "root"
	host = "local_pgdatabase"
	db = "postgres"
	Schema = "public"
	port = "5432"

	// conection string
	dataSourceName := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s search_path=%s sslmode=disable", host, username, password, db, port, Schema)

	Client, err = sqlx.Connect("postgres", dataSourceName)
	if err != nil {
		panic(err)
	}

	log.Println("database successfully configured")
}
