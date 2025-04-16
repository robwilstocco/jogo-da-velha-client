import "tailwindcss";
import { useEffect, useState } from 'react'
import { socket } from './socket';
import Square from './components/Square/Square';
import { RxCross1 } from "react-icons/rx";
import { FaRegCircle } from "react-icons/fa";
import { toast } from "react-toastify";

interface IPlayer {
  id: string,
  symbol: 'circle' | 'cross'
}

interface IGame {
  board: null[] | string[],
  players: {
    p1: IPlayer,
    p2: IPlayer,
    viewers: string[]
  },
  currentPlayer: null | string
}

function App() {

  
  const [player, setPlayer] = useState<IPlayer | null>(null);
  const [viewers, setviewers] = useState<string[]>([]);
  const [winner, setWinner] = useState<null | string>(null);
  const [winnerPosition, setWinnerPosition] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [board, setBoard] = useState<(null | string)[]>(Array(9).fill(null));
  const cross = (<RxCross1 className="w-10 h-10" />);
  const circle = (<FaRegCircle className="w-10 h-10" />);
  const notify = (message: string) => toast.info(message);
  
  useEffect(() => {
    socket.on('connect', () => {
      console.log("> Socket conectado", socket.id);
    }).emit("get_initial_state")

    socket.on("players", (players: IGame["players"]) => {
      if (players.p1?.id === socket.id) setPlayer(players.p1)
      else if (players.p2?.id === socket.id) setPlayer(players.p2)
    //ajustar cor quando algum jogador sai no meio da vitoria (a cor verde continua)
      setviewers(players.viewers)
    })

    socket.on("board", (newBoard: string[]) => {
      let temp = [...newBoard];
      setBoard(temp);
    })

    socket.on("turn", (turn: string) => {
      setCurrentPlayer(turn);
    })

    socket.on("message", (message: string) => {
      notify(message);
    })

    socket.on("winner", (winner) => {
      if (!winner) return
      setWinner(winner.player)
      setWinnerPosition(winner.positions)
    })

    socket.on("reset", () => {
      setWinner(null)
      setWinnerPosition([])
    })

    return () => {
      socket.off("connect");
      socket.off("players");
      socket.off("board");
      socket.off("turn");
      socket.off("message");
      socket.off("winner");
      socket.off("reset");
    }
  }, [])

  const renderSquare = (symbol: null | string) => {
    if(!symbol) return
    return symbol === 'circle' ?  circle : cross;
  };

  const handleBoard = (id: number) => {
    if (board[id] !== null || winner) return
    if (currentPlayer !== socket.id) {
      notify("NÃO E SUA VEZ")
      return
    }
    socket.emit("move", { position: id, symbol: player?.symbol })
  };

  const handleMatch = () => {
    socket.emit("reset")
    setWinner(null);
    setWinnerPosition([]);
  };

  return (
    <div className='h-screen w-screen bg-blue-300 flex'>
      <div className=" w-4/5 flex flex-col items-center justify-center h-screen bg-blue-300 gap-5">
        {winner && (
          <div className="flex gap-3 justify-center items-center">
            <h1>VENCEDOR: </h1>
            {winner === "circle" ? circle : cross}
          </div>
        )}
        <div className='grid grid-cols-3'>
          {board.map((pos, key) => (
            <Square key={key} id={key} handleButton={handleBoard} winner={winnerPosition.includes(key)}>{renderSquare(pos)}</Square>
          ))}
        </div>
        <button onClick={handleMatch} className="h-16 w-40 text-center text-white font-bold bg-blue-900 border-2 border-blue-900 rounded-lg hover:bg-blue-300 hover:text-blue-900 transition cursor-pointer">
          Nova Partida
        </button>
      </div>
      <div className='w-1/5 bg-gray-500 flex flex-col border-l-4 border-slate-900 gap-5'>
        <div>
          <p>your ID: {player?.id}</p>
          <h1>Players</h1>
          <p>turn: {currentPlayer}</p>
        </div>
        <div>
          <h1>Viewers</h1>
          {viewers.map(viewer => (
            <p key={viewer} className={viewer === socket.id ? 'text-lime-400' : ''}>{viewer}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
