import boto3

polly = boto3.client("polly", region_name="us-east-1")

response = polly.synthesize_speech(
    Text="Emergencia, necesito ayuda",
    OutputFormat="mp3",
    VoiceId="Lucia",  # Voz en español
)

with open("audio_input/test_emergencia.mp3", "wb") as f:
    f.write(response["AudioStream"].read())
