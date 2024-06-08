from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime, timezone

app = Flask(__name__)
CORS(app)

# MongoDB client setup
client = MongoClient('mongodb://localhost:27017/')
db = client['ranking_db']
rankings_collection = db['rankings']
votes_collection = db['votes']

@app.route('/create-ranking', methods=['POST'])
def create_ranking():
    data = request.json
    ranking = {
        'name': data['name'],
        'question': data['question'],
        'items': data['items'],
        'created_at': datetime.now(timezone.utc)
    }
    result = rankings_collection.insert_one(ranking)
    print(str(result.inserted_id))
    return jsonify({'id': str(result.inserted_id)}), 201

@app.route('/submit-vote', methods=['POST'])
def submit_vote():
    data = request.json
    vote = {
        'ranking_id': data['ranking_id'],
        'item1': data['item1'],
        'item2': data['item2'],
        'result': data['result']
    }
    votes_collection.insert_one(vote)
    return '', 204

@app.route('/get-ranking/<id>', methods=['GET'])
def get_ranking(id):
    ranking_id = ObjectId(id)
    ranking = rankings_collection.find_one({'_id': ranking_id})
    if not ranking:
        return jsonify({'error': 'Ranking not found'}), 404
    # Convert _id to string before jsonify
    ranking['_id'] = str(ranking['_id'])
    return jsonify(ranking), 200

@app.route('/final-ranking/<id>', methods=['GET'])
def final_ranking(id):
    try:
        votes = list(votes_collection.find({'ranking_id': id}))
        if not votes:
            return jsonify({'error': 'No votes found for this ranking'}), 404
        final_order = compile_results(votes)
        return jsonify(final_order), 200
    except:
        return jsonify({'error': 'Invalid ID format'}), 400

def compile_results(votes):
    items = set(v['item1'] for v in votes).union(set(v['item2'] for v in votes))
    # Implement your ranking algorithm here based on votes
    return list(items)

if __name__ == '__main__':
    app.run(debug=True)
