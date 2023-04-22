from random import *
from keras.datasets import mnist
import matplotlib.pyplot as plt
import numpy as np
import scipy.special
from scipy.ndimage import rotate
import base64
import io
from PIL import Image, ImageOps

def random_rotation(image, angle_range=(-10, 10)):
    angle = np.random.randint(angle_range[0], angle_range[1])
    return rotate(image, angle, reshape=False)

(x_train, y_train), (x_test, y_test) = mnist.load_data()


class NeuroNumbers:
    def __init__(self, inp, hid, out):
        self.weights_inptohid = np.random.randn(inp, hid) * np.sqrt(2.0 / inp)
        self.weights_hidtoout = np.random.randn(hid, out) * np.sqrt(2.0 / hid)
        self.biases_inptohid = np.zeros(hid)
        self.biases_hidtoout = np.zeros(out)

    def sigm(self, x):
        return 1 / (1 + np.exp(-x))

    def Psigm(self, x):
        return x * (1-x)

    def relu(self, x):
        return np.maximum(0, x)

    def d_relu(self, x):
        return np.where(x > 0, 1, 0)

    def forw(self, x):
        self.HiddenLayer = self.relu(np.dot(x, self.weights_inptohid) + self.biases_inptohid)
        self.OutputLayer = self.sigm(np.dot(self.HiddenLayer, self.weights_hidtoout) + self.biases_hidtoout)
        return self.OutputLayer

    def back(self, x, y, LearnRate):
        ErrOutput = y - self.OutputLayer
        DeltaOutput = ErrOutput * self.Psigm(self.OutputLayer)

        ErrHidden = np.dot(DeltaOutput, self.weights_hidtoout.T)
        DeltaHidden = ErrHidden * self.d_relu(self.HiddenLayer)

        self.weights_inptohid += np.dot(x.reshape(-1, 1), DeltaHidden.reshape(1, -1)) * LearnRate
        self.weights_hidtoout += np.dot(self.HiddenLayer.reshape(-1, 1), DeltaOutput.reshape(1, -1)) * LearnRate

        self.biases_inptohid += np.sum(DeltaHidden, axis=0) * LearnRate
        self.biases_hidtoout += np.sum(DeltaOutput, axis=0) * LearnRate

network = NeuroNumbers(784, 100, 10)

NamesToTrain = np.eye(10)[y_train]
NamesToTest = np.eye(10)[y_test]

#for element in NamesToTrain:
    #print(element)

x_train = x_train / 255
x_test = x_test / 255

network.weights_inptohid = np.load('firstlayer.npy')
network.weights_hidtoout = np.load('secondlayer.npy')




def solver(picture):
    head, enc = picture.split(',', 1)
    bindata = base64.b64decode(enc)
    image = Image.open(io.BytesIO(bindata))
    #image.show()
    rgb_image = Image.new("RGB", image.size, "WHITE")
    rgb_image.paste(image, (0, 0), image)

    rgb_image = rgb_image.resize((28, 28), Image.ANTIALIAS)

    gray_image = rgb_image.convert('L')  # Преобразование изображения в оттенки серого
    #gray_image.show()  # Проверьте результат после преобразования
    #gray_image.show()
    image_array = np.array(gray_image).astype(np.float32)
    #print(image_array)
    image_array = 255 - image_array
    image_array = image_array / 255



    possible = network.forw(image_array.flatten())
    #print(possible)

    #return 'Connected'
    return int(np.argmax(possible))
