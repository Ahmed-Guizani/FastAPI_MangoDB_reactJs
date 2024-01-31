from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
import jwt
from jwt import encode as jwt_encode
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from bson import ObjectId
from pymongo.errors import ServerSelectionTimeoutError

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.81.57:3000"],  # Add your frontend origin here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    username: str = None  # Make the username field optional
    email: str
    password: str

# MongoDB connection
client = MongoClient("mongodb://127.0.0.1:27017")

# Check if the connection is established
try:
    server_info = client.server_info()
    print("Connection to MongoDB is established.")
except ServerSelectionTimeoutError:
    print("Connection to MongoDB failed.")

db = client["mydatabase"]
users_collection = db["users"]

# Secret key for signing the token
SECRET_KEY = "your-secret-key-goes-here"
security = HTTPBearer()


@app.get("/")
def homepage():
    return {"message": "Welcome to the homepage"}


@app.post("/login")
def login(user: User):
    # Check if user exists in the database
    user_data = users_collection.find_one(
        {"email": user.email, "password": user.password}
    )
    if user_data:
        # Generate a token
        token = generate_token(user.email)
        # Convert ObjectId to string
        user_data["_id"] = str(user_data["_id"])
        # Store user details and token in local storage
        user_data["token"] = token
        return user_data
    return {"message": "Invalid email or password"}


@app.post("/register")
def register(user: User):
    # Check if user already exists in the database
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        return {"message": "User already exists"}
    # Insert the new user into the database
    user_dict = user.dict()
    users_collection.insert_one(user_dict)
    # Generate a token
    token = generate_token(user.email)
    # Convert ObjectId to string
    user_dict["_id"] = str(user_dict["_id"])
    # Store user details and token in local storage
    user_dict["token"] = token
    return user_dict


@app.get("/api/user")
def get_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Extract the token from the Authorization header
    token = credentials.credentials
    # Authenticate and retrieve the user data from the database based on the token
    # Here, you would implement the authentication logic and fetch user details
    # based on the token from the database or any other authentication mechanism
    # For demonstration purposes, assuming the user data is stored in local storage
    # Note: Local storage is not accessible from server-side code
    # This is just a placeholder to demonstrate the concept
    user_data = {
        "username": "iphone",
        "email": "iphone are very diffirents with a huge varieties",
    }
    if user_data["username"] and user_data["email"]:
        return user_data
    raise HTTPException(status_code=401, detail="Invalid token")


def generate_token(email: str) -> str:
    payload = {"email": email}
    token = jwt_encode(payload, SECRET_KEY, algorithm="HS256")
    return token


