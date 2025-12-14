import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../admin.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function Admin() {
  const navigate = useNavigate();

  // Redirection si pas connecté
  useEffect(() => {
    if (localStorage.getItem("admin_auth") !== "true") {
      navigate("/admin-login");
    }
  }, []);

  // Logout
  const logout = () => {
    localStorage.removeItem("admin_auth");
    navigate("/");
  };

  // -------------------------
  // TIMER
  // -------------------------
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

  const [randomEventTime, setRandomEventTime] = useState(null);
  const [canTriggerEvent, setCanTriggerEvent] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [eventAlreadyTriggeredThisRound, setEventAlreadyTriggeredThisRound] =
    useState(false);

  const eventCards = [
    "Team-up : Pair up with another player for this round.Combine your soft skills to solve the scenario.",
    "Swap Cards : You have 20 seconds less to answer this around.",
    "Unexpected Crisis : Your solution must now consider a sudden problem:budget is cut",
    "Role Reversal : You must act as the 'manager' for this round and give the solution as if you were in charge.",
    "Manager Override : The Game Master may interrupt and add an extra constraint.",
    "Team Vote : After your answer, the team votes it your solution is realistic.If not → redo!",
    "Time Pressure : You have 20 seconds less to answer this round.",
    "Limited Resources : You can only use ONE soft skill to solve the situation.",
    "Silent Round : Explain your solution WITHOUT speaking. Only gestures allowed.",
    "Double Challenge : Draw two Situation Cards and solve them together in one answer."
  ];

  // Timer loop
  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      setIsRunning(false);
      setCanTriggerEvent(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Détection du moment aléatoire
  useEffect(() => {
    if (!isRunning || randomEventTime === null) return;

    if (timeLeft === randomEventTime) {
      setCanTriggerEvent(true);
      setEventAlreadyTriggeredThisRound(true);
    }
  }, [timeLeft, isRunning, randomEventTime]);

  // Tirer une carte event
  const triggerEvent = () => {
    const randomEvent =
      eventCards[Math.floor(Math.random() * eventCards.length)];

    setActiveEvent(randomEvent);
    setCanTriggerEvent(false);
    setEventAlreadyTriggeredThisRound(true);
  };

  // -------------------------
  // SCOREBOARD
  // -------------------------
  const [players, setPlayers] = useState([]);

  const criteriaList = [
    "+3 Points = relevant soft skill",
    "+2 Points = clear communication",
    "+1 Point = creativity",
    "+1 Point = teamwork",
    "-1 Point = irrelevant answer",
    "-1 Point = poor communication",
  ];

  const resetAll = () => {
    if (!confirm("Reset the entire table?")) return;
    setPlayers([]);
    setScores({});
    localStorage.removeItem("battle_scores");
  };

  const handleAddPlayer = () => {
    if (players.length >= 12) return alert("Maximum 12 players!");
    setPlayers([...players, { name: "", scores: {} }]);
  };

  const handleRemovePlayer = () => {
    if (players.length <= 0) return alert("No players to remove!");
    setPlayers(players.slice(0, -1));
  };

  const handleNameChange = (index, value) => {
    const updated = [...players];
    updated[index].name = value;
    setPlayers(updated);
  };

  const handleScoreChange = (playerIndex, criteria, value) => {

  // 🔹 Autoriser le champ vide (pour effacer)
  if (value === "") {
    const updated = [...players];
    updated[playerIndex].scores[criteria] = "";
    setPlayers(updated);
    return;
  }

  // 🔹 Autoriser explicitement "0"
  if (value === "0") {
    const updated = [...players];
    updated[playerIndex].scores[criteria] = 0;
    setPlayers(updated);
    return;
  }

  // 🔹 Convertir en nombre
  const num = Number(value);

  // Si ce n'est pas un nombre -> bloqué
  if (isNaN(num)) return;

  // 🔹 Définir les bornes
  const min = criteria.includes("-1") ? -1 : 0;

  const max =
    criteria.includes("+3") ? 3 :
    criteria.includes("+2") ? 2 :
    criteria.includes("+1") ? 1 :
    criteria.includes("-1") ? 0 :
    0;

  // 🔹 Si hors barème → on bloque
  if (num < min || num > max) return;

  // 🔹 Mise à jour normale
  const updated = [...players];
  updated[playerIndex].scores[criteria] = num;
  setPlayers(updated);
};



  const getPlayerTotal = (player) => {
  let total = 0;

  for (const key in player.scores) {
    const value = parseInt(player.scores[key]);
    if (!isNaN(value)) total += value;
  }

  return total;
};


  // -------------------------
  // SAVE SCORES
  // -------------------------
  const [scores, setScores] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("battle_scores");
    if (saved) setScores(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("battle_scores", JSON.stringify(scores));
  }, [scores]);

  const updateScore = (player, criterion, value) => {
    setScores((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        [criterion]: value,
      },
    }));
  };

  const exportPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Battle Arena – Scoreboard", 14, 20);

  // Colonnes = noms des joueurs
  const head = [
    ["Critères", ...players.map((p) => p.name || "Player")]
  ];

  // Lignes = critères + scores
  const body = criteriaList.map((criteria) => [
    criteria,
    ...players.map((p) => p.scores[criteria] || 0)
  ]);

  // Ligne TOTAL
  const totalRow = [
    "TOTAL",
    ...players.map((p) => {
      let sum = 0;
      for (const k in p.scores) {
        const v = parseInt(p.scores[k]);
        if (!isNaN(v)) sum += v;
      }
      return sum;
    })
  ];

  body.push(totalRow);

  autoTable(doc, {
  startY: 30,
  head: head,
  body: body,
  theme: "grid",
  styles: { fontSize: 11 },
  headStyles: { fillColor: [61, 87, 28] }
});


  doc.save("scoreboard.pdf");
};

  // -------------------------
  // MAIN ADMIN PAGE
  // -------------------------
  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Scoreboard — Game Master</h1>

        {/* ---- ROW 1 : Boutons principaux ---- */}
        <div className="button-row">
          <button className="btn-reset" onClick={resetAll}>
            Reset the table
          </button>

          <button className="btn-add" onClick={handleAddPlayer}>
            ➕ Add a player (max 12)
          </button>

          <button className="btn-remove" onClick={handleRemovePlayer}>
            ➖ Remove a player
          </button>

          <button className="logout-btn" onClick={logout}>
            Log out
          </button>
        </div>

        {/* ---- ROW 2 : Timer ---- */}
        <div className="timer-row">
          <div className="timer-display">⏳ {timeLeft}s</div>

          <button
            className="btn-timer-start"
            disabled={isRunning}
            onClick={() => {
              setIsRunning(true);

              if (eventAlreadyTriggeredThisRound) return;
/* Probabilité a 50% */
              const willTrigger = Math.random() < 0.5;

              if (willTrigger) {
                const randomTime =
                  Math.floor(Math.random() * (20 - 10 + 1)) + 10;
                setRandomEventTime(randomTime);
              } else {
                setRandomEventTime(null);
              }
            }}
          >
            ▶️ Start
          </button>

          <button
            className="btn-timer-stop"
            disabled={!isRunning}
            onClick={() => setIsRunning(false)}
          >
            ⏸️ Stop
          </button>

          <button
            className="btn-timer-reset"
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(30);
              setRandomEventTime(null);
              setCanTriggerEvent(false);
              setActiveEvent(null);
              setEventAlreadyTriggeredThisRound(false);
            }}
          >
            🔄 Reset
          </button>

          {canTriggerEvent && (
            <button className="btn-event" onClick={triggerEvent}>
              🎲 Tirer une carte Event
            </button>
          )}
                
          {activeEvent && (
  <div className="event-inline">
    <span>{activeEvent}</span>
    <button className="event-ok" onClick={() => setActiveEvent(null)}>
      OK
    </button>
  </div>
)}

        </div>
      </header>

      {/* ---- TABLE ---- */}
      <div className="score-table-wrapper">
        <table className="score-table">
          <thead>
            <tr>
              <th>Points system</th>
              {players.map((p, index) => (
                <th key={index}>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    className="player-input"
                  />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {criteriaList.map((criteria, ci) => (
              <tr key={ci}>
                <td className="criteria-cell">{criteria}</td>

                {players.map((p, index) => (
                  <td key={index}>
                    <input
  type="number"
  className="score-input"
  value={p.scores[criteria] || ""}
  onChange={(e) =>
    handleScoreChange(index, criteria, e.target.value)
  }

  min={
    criteria.includes("-1") ? -1 : 0
  }
  max={
    criteria.includes("+3") ? 3 :
    criteria.includes("+2") ? 2 :
    criteria.includes("+1") ? 1 :
    criteria.includes("-1") ? 0 :
    0
  }

  placeholder={
    criteria.includes("+3") ? "0-3" :
    criteria.includes("+2") ? "0-2" :
    criteria.includes("+1") ? "0-1" :
    criteria.includes("-1") ? "-1-0" :
    ""
  }
/>

                  </td>
                ))}
              </tr>
            ))}
            {/* ---- TOTAL ROW ---- */}
          </tbody>

<tfoot>
  <tr className="total-row">
    <td className="criteria-cell total-label">TOTAL</td>
    {players.map((p, index) => (
      <td key={index} className="total-cell">
        <strong>{getPlayerTotal(p)}</strong>
      </td>
    ))}
  </tr>
</tfoot>

        </table>
      </div>

      <button className="btn-export" onClick={exportPDF}>
  Export to PDF
</button>

    </div>
  );
}
