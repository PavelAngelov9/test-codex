import React, { useState, useEffect } from 'react';

const suits = ['♣', '♦', '♥', '♠'];
const ranks = ['7', '8', '9', 'J', 'Q', 'K', '10', 'A'];
const rankOrder = { '7': 0, '8': 1, '9': 2, 'J': 3, 'Q': 4, 'K': 5, '10': 6, 'A': 7 };

function createDeck() {
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function deal(deck) {
  const hands = [[], [], [], []];
  deck.forEach((card, idx) => {
    hands[idx % 4].push(card);
  });
  return hands;
}

function legalMoves(hand, leadSuit) {
  if (!leadSuit) return hand;
  const sameSuit = hand.filter(c => c.suit === leadSuit);
  return sameSuit.length ? sameSuit : hand;
}

function botMove(hand, leadSuit) {
  const moves = legalMoves(hand, leadSuit);
  return moves[Math.floor(Math.random() * moves.length)];
}

function computeWinner(trick, leadSuit) {
  const leadCards = trick.filter(t => t.card.suit === leadSuit);
  let best = leadCards[0];
  for (const play of leadCards.slice(1)) {
    if (rankOrder[play.card.rank] > rankOrder[best.card.rank]) {
      best = play;
    }
  }
  return best.player;
}

export default function App() {
  const [hands, setHands] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [trick, setTrick] = useState([]); // {player, card}
  const [leadSuit, setLeadSuit] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const deck = shuffle(createDeck());
    const dealt = deal(deck);
    setHands(dealt);
  }, []);

  useEffect(() => {
    if (hands.length && currentPlayer !== 0 && hands[currentPlayer].length) {
      const timer = setTimeout(() => {
        const hand = hands[currentPlayer];
        const card = botMove(hand, leadSuit);
        playCard(card);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, hands, leadSuit]);

  useEffect(() => {
    if (trick.length === 4) {
      const winner = computeWinner(trick, leadSuit);
      setCurrentPlayer(winner);
      setTrick([]);
      setLeadSuit(null);
      if (hands[0].length === 0) {
        setMessage('Game over!');
      }
    }
  }, [trick, leadSuit, hands]);

  function playCard(card) {
    setHands(prev => {
      const newHands = prev.map(h => h.slice());
      const playerHand = newHands[currentPlayer];
      const idx = playerHand.findIndex(c => c.suit === card.suit && c.rank === card.rank);
      playerHand.splice(idx, 1);
      return newHands;
    });
    setTrick(prev => [...prev, { player: currentPlayer, card }]);
    if (!leadSuit) setLeadSuit(card.suit);
    setCurrentPlayer((currentPlayer + 1) % 4);
  }

  const playerHand = hands[0] || [];
  const isPlayersTurn = currentPlayer === 0;
  const legal = legalMoves(playerHand, leadSuit);

  return (
    <div>
      <h1>Simple Belote</h1>
      {message && <p>{message}</p>}
      <div className="trick">
        {trick.map(t => (
          <div key={t.player}>P{t.player + 1}: {t.card.rank}{t.card.suit}</div>
        ))}
      </div>
      <div className="hand">
        {playerHand.map((card, i) => (
          <button
            key={i}
            disabled={!isPlayersTurn || !legal.some(c => c === card)}
            onClick={() => playCard(card)}
          >
            {card.rank}{card.suit}
          </button>
        ))}
      </div>
      <div className="bots">
        {[1, 2, 3].map(p => (
          <div key={p}>Bot {p}: {hands[p] ? hands[p].length : 0} cards</div>
        ))}
      </div>
    </div>
  );
}
