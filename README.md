### wyd?

wyd? is an AI journaling app that calls you every night to talk to you about your day. Made for Hack The Valley 2025

### backend
Python, FastAPI, SQLAlchemy, Alembic, NeonDB (Postgres), ElevenLabs

### frontend (mobile app)
React-Native (Expo)

### installation
```bash
$ cd backend ; python -m venv .venv # create virtual env
$ source .venv/bin/activate # unix/linux
> .venv\Scripts\activate # windows
$ pip install -r requirements.txt # install dependencies for app
$ uvicorn main:app --host 0.0.0.0 --port 8000 # or fastapi run for prod

# running the react native app on expo
$ cd frontend
$ npm i
$ npm run start # or npx expo (open qr code or open on browser)
```