# move everything together 
import random
import json
import jsonlines
import torch
import numpy as np
import torch.nn as nn
import nltk
from nltk.stem.porter import PorterStemmer
stemmer = PorterStemmer()

class NeuralN(nn.Module):
    def __init__(self, input_size, hidden_size, num_classes):
        # define layers
        super(NeuralN, self).__init__()
        self.l1 = nn.Linear(input_size, hidden_size) 
        self.l2 = nn.Linear(hidden_size, hidden_size) 
        self.l3 = nn.Linear(hidden_size, num_classes)
        self.relu = nn.ReLU()
    
    def forward(self, x):
        out = self.l1(x)
        out = self.relu(out)
        out = self.l2(out)
        out = self.relu(out)
        out = self.l3(out)
        return out

def tokenize(sentence):
    return nltk.word_tokenize(sentence)

# find the root 
def stem(word):
    return stemmer.stem(word.lower())

# determine each word in the sentence 
def bag_of_words(tokenized, words):
    # break down the sentence
    sentence = [stem(word) for word in tokenized]

    # initialize
    bag = np.zeros(len(words), dtype=np.float32)
    # mark 1 if exist
    for i, w in enumerate(words):
        if w in sentence:
            bag[i] = 1

    return bag

# use gpu
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# upload file 
intents = []
with jsonlines.open('./source/intent.jsonl', 'r') as reader:
    for obj in reader:
        intents.append(obj)

# load the model 
FILE = "data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

model = NeuralN(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

# interaction with you 
bot_name = "CC"
print("Let's chat! (type 'quit' to exit)")

while True:
    sentence = input("You: ")
    if sentence == "quit":
        break

    sentence = tokenize(sentence)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.8:
        for intent in intents:
            if tag == intent["tag"]:
                print(f"{bot_name}: {random.choice(intent['responses'])}")
    else:
        print(f"{bot_name}: Can you word it in another way/")