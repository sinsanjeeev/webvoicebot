import json
from os.path import join, dirname
from ibm_watson import SpeechToTextV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
import os
from dotenv import load_dotenv


load_dotenv()
SECRET_KEY = os.environ.get("SPEECH_TO_TEXT_APIKEY")
URL= os.environ.get("SPEECH_TO_TEXT_URL")
authenticator = IAMAuthenticator(SECRET_KEY)
sttService = SpeechToTextV1(authenticator=authenticator)
sttService.set_service_url(URL)
with open('C:/Users/SanjeevSinha/Desktop/audio-file.flac',
               'rb') as audio_file:
    speech_recognition_results = sttService.recognize(
        audio=audio_file,
        content_type='audio/flac',
        timestamps=True,
        word_confidence=True,
        smart_formatting=True
    ).get_result()
print(speech_recognition_results['results'][0]['alternatives'][0]['transcript'])