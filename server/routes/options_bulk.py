from fastapi import APIRouter, HTTPException
from utils.fetch_data import fetch_options_data
from models.option_bulk_model import OptionBulkRequest, OptionBulkResponse

router = APIRouter()


@router.post("/options-data", response_model=list[OptionBulkResponse])
def get_options_data(request: OptionBulkRequest):
    """
    API endpoint to fetch multiple option contracts based on user filters.

    Returns:
    - JSON list containing up to 10 options matching the criteria.
    """
    data = fetch_options_data(
        symbol=request.symbol,
        total_results=request.total_results,
    )

    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])

    return data
