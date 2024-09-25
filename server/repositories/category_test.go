package repositories_test

import (
	"regexp"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/cheetahybte/keinbudget/repositories"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/assert"
)

func TestCreateCategoryWithoutParent(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewCategoryRepository(sqlxDB)

	userId := uuid.New()
	categoryName := "Test"

	mock.ExpectExec("insert into categories").
		WithArgs(sqlmock.AnyArg(), userId, categoryName).WillReturnResult(sqlmock.NewResult(1, 1))

	category, err := repo.CreateCategory(userId, categoryName)

	assert.NoError(t, err)
	assert.NotNil(t, category)
	assert.Equal(t, categoryName, category.Name)
	assert.Equal(t, userId, category.UserID)
	assert.NotNil(t, category.ID)
	assert.Equal(t, category.Parent, uuid.Nil)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestCreateCategoryWithParent(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewCategoryRepository(sqlxDB)

	userId := uuid.New()
	categoryName := "Test"
	parentId := uuid.New()

	mock.ExpectExec("insert into categories").
		WithArgs(sqlmock.AnyArg(), userId, categoryName, parentId).WillReturnResult(sqlmock.NewResult(1, 1))

	category, err := repo.CreateCategoryWithParent(userId, parentId, categoryName)

	assert.NoError(t, err)
	assert.NotNil(t, category)
	assert.Equal(t, categoryName, category.Name)
	assert.Equal(t, userId, category.UserID)
	assert.Equal(t, parentId, category.Parent)
	assert.NotNil(t, category.ID)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetCategory(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewCategoryRepository(sqlxDB)

	userId := uuid.New()
	catId := uuid.New()
	catName := "Testing category"

	rows := sqlmock.NewRows([]string{"id", "user_id", "name", "parent_id"}).AddRow(catId, userId, catName, uuid.Nil)
	mock.ExpectQuery("select \\* from categories where id = ?").WithArgs(catId).WillReturnRows(rows)
	category, err := repo.GetCategory(catId)

	assert.NoError(t, err)
	assert.NotNil(t, category)
	assert.Equal(t, catId, category.ID)
	assert.Equal(t, catName, category.Name)
	assert.Equal(t, userId, category.UserID)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetAllCategoriesForUser(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewCategoryRepository(sqlxDB)

	userId := uuid.New()
	pId := uuid.New()
	cId := uuid.New()

	rows := sqlmock.NewRows([]string{"id", "name", "parent_id", "user_id"}).
		AddRow(pId, "category", nil, userId).
		AddRow(cId, "sub-category", pId, userId)

	mock.ExpectQuery("select \\* from categories where user_id = ?").
		WithArgs(userId).
		WillReturnRows(rows)

	categories, err := repo.GetCategories(userId)
	assert.NoError(t, err)
	assert.Len(t, categories, 2)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestDeleteCategory(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	sqlxDB := sqlx.NewDb(db, "sqlmock")
	repo := repositories.NewCategoryRepository(sqlxDB)

	userID := uuid.New()
	categoryID := uuid.New()

	mock.ExpectExec(regexp.QuoteMeta("delete from categories where id = ? and user_id = ?")).
		WithArgs(categoryID, userID).
		WillReturnResult(sqlmock.NewResult(1, 1))

	err = repo.DeleteCategory(userID, categoryID)

	assert.NoError(t, err)
	assert.NoError(t, mock.ExpectationsWereMet())
}
