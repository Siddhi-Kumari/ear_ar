from flask import Flask, request, jsonify, Response
from flask_cors import CORS  # Import CORS
import cv2
import numpy as np
import base64
from ear_detector import EarDetector

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
detector = EarDetector()

@app.route('/detect', methods=['POST'])
def detect():
    data = request.get_json()
    image_data = data['image'].split(',')[1]  # Remove metadata
    image = base64.b64decode(image_data)
    nparr = np.frombuffer(image, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Get ear landmarks
    landmarks = detector.get_ear_coordinates(img)

    return jsonify({'landmarks': landmarks})

def generate_video_feed():
    video_capture = cv2.VideoCapture(0)  # Open the default camera
    while True:
        success, frame = video_capture.read()
        if not success:
            break
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_video_feed(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)
