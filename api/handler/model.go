package api

type Logininfo struct {
	Name     string `json:"name" db:"name"`
	Password string `json:"password" db:"password"`
	Email    string `json:"email" db:"email"`
}

type Editinfo struct {
	ID       int    `json:"id" db:"id"`
	Name     string `json:"name" db:"name"`
	Password string `json:"password" db:"password"`
	Email    string `json:"email" db:"email"`
}

type Userinfo struct {
	Username string `json:"username" db:"username"`
	Email    string `json:"email" db:"email"`
}

type Registerinfo struct {
	ID       int    `json:"id" db:"id"`
	Username string `json:"username" db:"username"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type UserGetinfo struct {
	ID       int    `json:"id" db:"id"`
	Name     string `json:"name" db:"name"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type PredictData struct {
	Data []struct {
		Predictions []struct {
			Date     string  `json:"date"`
			Forecast float64 `json:"forecast"`
			Real     string  `json:"real"`
		} `json:"predictions"`
		ProductName string `json:"product_name"`
	} `json:"data"`
	Success string `json:"success"`
}

type PredictProductData struct {
	Predictions []struct {
		Date     string  `json:"date"`
		Forecast float64 `json:"forecast"`
		Real     string  `json:"real"`
	} `json:"predictions"`
	ProductName string `json:"product_name"`
}

type CSVData struct {
	Product string `json:"product_name"`
	Date    string `json:"date"`
	Count   int    `json:"count"`
}

type InputData struct {
	Name  string `json:"name"`
	Date  string `json:"date"`
	Count int    `json:"count"`
}

type RetrainStatus struct {
	Success bool `json:"success"`
}

type InputProduct struct {
	Date string `json:"input_date"`
	Sold int    `json:"sold"`
}
