from fastapi import APIRouter, HTTPException
from utils.fetch_data import fetch_options_data
from models.option_bulk_model import OptionBulkRequest, OptionBulkResponse

router = APIRouter()


@router.post("/options-data", response_model=list[OptionBulkResponse])
def get_options_data(request: OptionBulkRequest):
    """
    API endpoint to fetch multiple option contracts based on user filters.

    Parameters:
    - symbols (list): List of stock ticker symbols.
    - expiration (str):  expiration date.
    - min_strike (float): Minimum strike price.
    - max_strike (float): Maximum strike price.
    - option_type (str): "call", "put", or "both".

    Returns:
    - JSON list containing up to 10 options matching the criteria.
    """
    data = fetch_options_data(
        symbols=request.symbols,
        expiration=request.expiration,
        min_strike=request.min_strike,
        max_strike=request.max_strike,
        option_type=request.option_type,
        total_results=request.total_results,
    )

    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])

    return data
