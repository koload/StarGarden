from celery import shared_task
from datetime import datetime

@shared_task
def test_func():
    print(f'Test function executed at {datetime.now()}')