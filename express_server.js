const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const generateRandomChar = () => {
  const randomNumber = Math.floor(Math.random() * (57 - 48 + 1)) + 48;
  const randomCapitalLetter = Math.floor(Math.random() * (90 - 65 + 1)) + 65;
  const randomLowercaseLetter = Math.floor(Math.random() * (122 - 97 + 1)) + 97;
  const charType = Math.floor(Math.random() * 3) + 1;

  let charCode;
  if (charType === 1) charCode = randomNumber;
  if (charType === 2) charCode = randomCapitalLetter;
  if (charType === 3) charCode = randomLowercaseLetter;

  return String.fromCharCode(charCode);
}

const generateRandomString = (length) => {
  let str = "";

  while (str.length < length) {
    str += generateRandomChar();
  }

  return str;
}

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/urls/:id", (req, res) => {
  const { id } = req.params;
  const { longURL } = req.body;
  urlDatabase[id] = longURL;
  res.redirect("/urls");
})

app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];

  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  console.log(username);
  res.cookie("username", username);
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  res.render("login_page");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };

  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const { longURL } = req.body;
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = longURL;

  res.redirect(`/u/${shortURL}`)
});

app.get("/u/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const longURL = urlDatabase[shortURL]

  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const templateVars = {
    shortURL,
    longURL: urlDatabase[shortURL],
    username: req.cookies["username"]
  };

  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});