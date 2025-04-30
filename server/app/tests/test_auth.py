import pytest
from app.core.auth import get_current_user, SECRET_KEY, ALGORITHM
from app.database.models import User
from jose import jwt
from uuid import uuid4
from fastapi import HTTPException
from unittest.mock import AsyncMock

@pytest.mark.asyncio
async def test_get_current_user_valid_token(mocker):
    user_id = uuid4()
    token = jwt.encode({"sub": str(user_id)}, SECRET_KEY, algorithm=ALGORITHM)

    mock_user = User(id=user_id, email="test@example.com")
    mocker.patch("app.core.auth.User.get_or_none", return_value=mock_user)

    result = await get_current_user(token)
    assert result == mock_user

@pytest.mark.asyncio
async def test_get_current_user_invalid_token():
    with pytest.raises(HTTPException) as exc_info:
        await get_current_user("invalid.token.value")

    assert exc_info.value.status_code == 401
    assert "invalid token" in str(exc_info.value.detail)

@pytest.mark.asyncio
async def test_get_current_user_user_not_found(mocker):
    user_id = uuid4()
    token = jwt.encode({"sub": str(user_id)}, SECRET_KEY, algorithm=ALGORITHM)

    mocker.patch(
        "app.core.auth.User.get_or_none",
        new_callable=AsyncMock,
        return_value=None,
    )

    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(token)

    assert exc_info.value.status_code == 401
    assert "User not found" in str(exc_info.value.detail)
