from fastapi import APIRouter, HTTPException, Query
from utils.fetch_data import fetch_options_data
from models.option_bulk_model import OptionBulkResponse

router = APIRouter()


@router.get("/options-data", response_model=list[OptionBulkResponse])
def get_options_data(symbol: str, total_results: int = Query(10, ge=1, le=10)):
    """
    API endpoint to fetch multiple option contracts based on user filters.

    Parameters:
    - symbol (str): The stock ticker symbol.
    - total_results (int): Number of results to return (default=10, max=10).

    Returns:
    - JSON list containing up to 10 options matching the criteria.
    """
    data = fetch_options_data(symbol=symbol, total_results=total_results)

    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])

    return data
