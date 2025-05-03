from pydantic import (
    BaseModel,
    Field,
    ConfigDict
)
from pydantic.alias_generators import to_camel

class FinanceOverview(BaseModel):
    totalBalance: float = Field(..., alias="total_balance")
    income: float = Field(...,)
    expenses: float = Field(...,)
    savings: float = Field(...,)
    
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )
    
class FinanceMonthlyReport(BaseModel):
    month: str
    income: float
    expenses: float