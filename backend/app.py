from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

USER_WALLET = {
    "balance": 10000.00,
    "equity": 10000.00,
    "floating_pnl": 0.00,
    "currency": "USD"
}

active_positions = []
settled_history = []

# Dynamic reference price generator for top assets to keep tick simulation look realistic
def get_mock_spot_price(symbol):
    prices = {
        "XAUUSD": 2347.10,
        "BTCUSD": 67450.00,
        "EURUSD": 1.0850,
        "USOIL": 78.40,
        "AAPL": 192.30
    }
    return prices.get(symbol, 100.0)

@app.route('/api/account-metrics', methods=['GET'])
def get_metrics():
    global USER_WALLET, active_positions
    
    # Fast tick dynamic profit/loss shifter for all selected symbols
    for trade in active_positions:
        trade['profit'] += random.choice([-0.4, 0.35, 0.7, -0.6])
        
    USER_WALLET["floating_pnl"] = sum(t['profit'] for t in active_positions)
    USER_WALLET["equity"] = USER_WALLET["balance"] + USER_WALLET["floating_pnl"]
    
    return jsonify({
        "status": "success",
        "wallet": USER_WALLET,
        "active_trades": active_positions,
        "history": settled_history
    })

@app.route('/api/wallet-action', methods=['POST'])
def wallet_action():
    global USER_WALLET, active_positions, settled_history
    req_data = request.get_json()
    action_type = req_data.get('action')
    amount = float(req_data.get('amount', 0))

    if action_type == 'RESET':
        active_positions.clear()
        settled_history.clear()
        USER_WALLET["balance"] = 10000.00
        USER_WALLET["floating_pnl"] = 0.00
        USER_WALLET["equity"] = 10000.00
        return jsonify({"status": "success", "message": "Prop Challenge reset to $10,000.00 successfully!"})

    elif action_type == 'ADD':
        USER_WALLET["balance"] += amount
        return jsonify({"status": "success", "message": f"${amount} credited successfully."})

    elif action_type == 'WITHDRAW':
        if amount > USER_WALLET["balance"]:
            return jsonify({"status": "error", "message": "Insufficient balance."}), 400
        if len(active_positions) > 0:
            return jsonify({"status": "error", "message": "Cannot withdraw while positions are active."}), 403
        USER_WALLET["balance"] -= amount
        return jsonify({"status": "success", "message": f"${amount} withdrawn successfully."})

    return jsonify({"status": "error", "message": "Undefined action."}), 400

@app.route('/api/execute-order', methods=['POST'])
def execute_order():
    global USER_WALLET, active_positions
    req_data = request.get_json()
    symbol = req_data.get('symbol', 'XAUUSD') # Captures custom selected symbol
    action = req_data.get('action')
    lots = float(req_data.get('lots', 0.01))

    if USER_WALLET["balance"] <= 0:
        return jsonify({"status": "error", "message": "Margin dry. Reset challenge to restore funds."}), 403

    ticket = random.randint(800000, 999999)
    new_trade = {
        "ticket": ticket,
        "symbol": symbol, # Saved dynamically
        "type": action,
        "volume": lots,
        "price_open": get_mock_spot_price(symbol),
        "profit": random.uniform(-1.0, 1.0)
    }
    active_positions.append(new_trade)
    return jsonify({"status": "success", "message": f"{symbol} {action} position #{ticket} routed successfully!"})

@app.route('/api/close-order', methods=['POST'])
def close_order():
    global USER_WALLET, active_positions, settled_history
    req_data = request.get_json()
    ticket_id = int(req_data.get('ticket'))

    for trade in active_positions:
        if trade['ticket'] == ticket_id:
            USER_WALLET["balance"] += trade['profit']
            settled_history.insert(0, trade)
            active_positions.remove(trade)
            return jsonify({"status": "success", "message": f"Position #{ticket_id} settled."})

    return jsonify({"status": "error", "message": "Position not found."}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)