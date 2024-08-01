import cv2
from face_mesh_model import FaceMeshModel

class EarDetector:
    def __init__(self):
        self.face_mesh_model = FaceMeshModel()

    def process_frame(self, frame):
        return self.face_mesh_model.get_ear_coordinates(frame)
