package repositories

import (
	"github.com/cheetahybte/keinbudget/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type CategoryRepository struct {
	db *sqlx.DB
}

func NewCategoryRepository(db *sqlx.DB) *CategoryRepository {
	return &CategoryRepository{
		db,
	}
}

func (r *CategoryRepository) CreateCategory(user uuid.UUID, name string) (*types.Category, error) {
	category := &types.Category{
		ID:     uuid.New(),
		UserID: user,
		Name:   name,
	}

	_, err := r.db.NamedExec("insert into categories(id, user_id, name) values(:id, :user_id, :name)", category)
	if err != nil {
		return nil, err
	}

	return category, nil
}

func (r *CategoryRepository) CreateCategoryWithParent(user uuid.UUID, parent uuid.UUID, name string) (*types.Category, error) {
	category := &types.Category{
		ID:     uuid.New(),
		UserID: user,
		Parent: parent,
		Name:   name,
	}

	_, err := r.db.NamedExec("insert into categories(id, user_id, name, parent_id) values(:id, :user_id, :name, :parent_id)", category)
	if err != nil {
		return nil, err
	}

	return category, nil
}

func (r *CategoryRepository) GetCategory(catId uuid.UUID) (*types.Category, error) {
	var category types.Category

	err := r.db.Get(&category, "select * from categories where id = ?", catId)

	if err != nil {
		return nil, err
	}

	return &category, nil
}

func (r *CategoryRepository) GetCategories(user uuid.UUID) ([]*types.Category, error) {
	var categories []*types.Category
	err := r.db.Select(&categories, "select * from categories where user_id = ?", user)
	if err != nil {
		return []*types.Category{}, err
	}
	return categories, nil
}

func (r *CategoryRepository) DeleteCategory(user, id uuid.UUID) error {
	_, err := r.db.Exec("delete from categories where id = ? and user_id = ?", id, user)
	if err != nil {
		return err
	}
	return nil
}
