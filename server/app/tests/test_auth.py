from fastapi.testclient import TestClient
from app.database.models import User
from uuid import uuid4
from unittest.mock import patch, AsyncMock
from app.server import app
from passlib.hash import argon2

client = TestClient(app)


def test_login_route_without_body():
    response = client.post("/api/v1/auth/login", data={})
    assert response.status_code == 422


@patch("app.database.models.User.get_or_none", new_callable=AsyncMock)
def test_login_wrong_password(mock_get):
    # create fake user
    pwd_hash = argon2.hash("password")
    fake_user = User(id=uuid4(), email="test@test.de", password_hash=pwd_hash)
    mock_get.return_value = fake_user
    # request
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "test@test.de", "password": "abcabc"},
    )
    assert response.status_code == 401

@patch("app.database.models.User.get_or_none", new_callable=AsyncMock)
def test_login_right_password_without_2fa(mock_get):
    # create fake user
    pwd_hash = argon2.hash("password")
    fake_user = User(id=uuid4(), email="test@test.de", password_hash=pwd_hash)
    mock_get.return_value = fake_user
    # request
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "test@test.de", "password": "password"},
    )
    j = response.json()
    assert response.status_code == 200
    assert j.get("token_type") == "bearer"
    assert not j.get("intermediate")
    
@patch("app.database.models.User.get_or_none", new_callable=AsyncMock)
def test_login_2fa_enabled_step_one(mock_get):
    # create fake user
    pwd_hash = argon2.hash("password")
    fake_user = User(id=uuid4(), email="test@test.de", password_hash=pwd_hash, twofa_enabled=True)
    mock_get.return_value = fake_user
    # request
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "test@test.de", "password": "password"},
    )
    j = response.json()
    assert response.status_code == 200
    assert j.get("token_type") == "bearer"
    assert j.get("intermediate")