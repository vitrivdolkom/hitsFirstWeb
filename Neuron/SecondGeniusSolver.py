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

network = NeuroNumbers(784, 150, 10)

NamesToTrain = np.eye(10)[y_train]
NamesToTest = np.eye(10)[y_test]

#for element in NamesToTrain:
    #print(element)

x_train = x_train / 255
x_test = x_test / 255

network.weights_inptohid = np.load('F.npy')
network.weights_hidtoout = np.load('S.npy')

for epoch in range(4):
    print(f'Идёт обучение... Эпоха: {epoch}')
    for pic, res in zip(x_train, NamesToTrain):
        network.forw(pic.flatten())
        network.back(pic.flatten().reshape(1, -1), res.reshape(1, -1), 0.02)

np.save('F.npy', network.weights_inptohid)
np.save('S.npy', network.weights_hidtoout)

network.weights_inptohid = np.load('F.npy')
network.weights_hidtoout = np.load('S.npy')

okay = 0
total = 0

for pic, res in zip(x_test, NamesToTest):
    possible = network.forw(pic.flatten())
    okay += np.argmax(possible) == np.argmax(res)
    total += 1
print(f'Точность: {(okay/total) * 100} %')
