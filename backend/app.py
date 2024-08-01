from flask import Flask, jsonify, send_file
from flask_cors import CORS
import cv2
from ear_detector import EarDetector

app = Flask(__name__)
CORS(app)

ear_detector = EarDetector()

def get_camera_image():
    cap = cv2.VideoCapture(0)  # 0 for default camera
    ret, frame = cap.read()
    cap.release()
    if ret:
        return frame
    return None

@app.route('/ear_coordinates', methods=['GET'])
def get_ear_coordinates():
    image = get_camera_image()
    if image is not None:
        coordinates = ear_detector.get_ear_coordinates(image)
        return jsonify(coordinates)
    return jsonify({"error": "Unable to capture image"}), 500

@app.route('/video_feed', methods=['GET'])
def video_feed():
    return send_file('video_feed.mp4', mimetype='video/mp4')

if __name__ == '__main__':
    app.run(debug=True)
