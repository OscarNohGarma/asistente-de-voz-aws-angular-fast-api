#Script to detect keywords in a transcript
def detect_keywords(transcript, keywords):
    transcript = transcript.lower()
    return [word for word in keywords if word in transcript]