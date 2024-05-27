import { useEffect, useState } from "react";
import { auth, getLeaderboard } from "../../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Leaderboard = ({ level, currentUser, quizState }) => {
  const [topPlayers, setTopPlayers] = useState([]);
  async function fetchLeaderboard() {
    const players = await getLeaderboard();
    setTopPlayers(players);
  }
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [quizState]);

  return (
    <div className="p-4 text-black border-2 border-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-white uppercase">
        Leaderboard
      </h2>
      <ul className="space-y-2">
        {topPlayers.map((player, index) => (
          <li
            key={index}
            className={`flex justify-between p-2 rounded-lg hover:bg-[#002e5d] ${
              currentUser && player.id === currentUser.uid
                ? "bg-yellow-200"
                : "bg-[#2a639b] text-white"
            }`}
          >
            <span>
              {player.rank}. {player.name}
            </span>
            <span>{player.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
