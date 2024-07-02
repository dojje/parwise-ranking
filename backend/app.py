from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime, timezone
import secrets
import string
from collections import defaultdict

app = Flask(__name__)
CORS(app)

# MongoDB client setup
client = MongoClient('mongodb://localhost:27017/')
db = client['ranking_db']
rankings_collection = db['rankings']
votes_collection = db['votes']

def generate_code(length=7):
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length)).lower()

@app.route('/create-ranking', methods=['POST'])
def create_ranking():
    data = request.json
    code = generate_code()
    ranking = {
        '_id': code,
        'name': data['name'],
        'question': data['question'],
        'items': data['submitItems'],
        'created_at': datetime.now(timezone.utc),
        'votes': 0
    }
    rankings_collection.insert_one(ranking)
    return jsonify({'id': code}), 201

@app.route('/submit-vote', methods=['POST'])
def submit_vote():
    data = request.json
    ranking_id = data['ranking_id'].lower()
    item1 = data['item1']
    item2 = data['item2']
    result = data['result']

    # Check if the vote already exists
    vote = votes_collection.find_one({'ranking_id': ranking_id, 'item1': item1, 'item2': item2})
    if not vote:
        vote = votes_collection.find_one({'ranking_id': ranking_id, 'item1': item2, 'item2': item1})
        if vote:
            # Swap items if the reverse pair exists
            item1, item2 = item2, item1

    if vote:
        # Update the score based on the result
        new_score = vote['score'] + 1 if result == item1 else vote['score'] - 1
        votes_collection.update_one({'_id': vote['_id']}, {'$set': {'score': new_score, 'votes': vote.get('votes', 0) + 1}})
    else:
        # Create a new vote pair with the initial score
        initial_score = 1 if result == item1 else -1
        votes_collection.insert_one({'ranking_id': ranking_id, 'item1': item1, 'item2': item2, 'score': initial_score, 'votes': 1})

    return '', 204

@app.route('/get-ranking/<id>', methods=['GET'])
def get_ranking(id):
    ranking_id = id.lower()
    ranking = rankings_collection.find_one({'_id': ranking_id})
    if not ranking:
        return jsonify({'error': 'Ranking not found'}), 404
    ranking['_id'] = str(ranking['_id'])
    return jsonify(ranking), 200

@app.route('/final-ranking/<id>', methods=['GET'])
def final_ranking(id):
    try:
        ranking_id = id.lower()
        votes = list(votes_collection.find({'ranking_id': ranking_id}))
        if not votes:
            return jsonify({'error': 'No votes found for this ranking'}), 404
        final_order, nvotes = compile_results(votes)
        return jsonify({'final_order': final_order, 'nvotes': nvotes}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def compile_results(votes):
    score_map = defaultdict(int)
    total_votes = 0

    # Aggregate scores
    for vote in votes:
        item1 = vote['item1']
        item2 = vote['item2']
        score = vote['score']
        vote_count = vote.get('votes', 1)  # Default to 1 if 'votes' field doesn't exist
        score_map[item1] += score
        score_map[item2] -= score
        total_votes += vote_count

    # Sort items by score
    sorted_items = sorted(score_map.keys(), key=lambda x: score_map[x], reverse=True)
    return sorted_items, total_votes

if __name__ == '__main__':
    app.run(debug=True)
