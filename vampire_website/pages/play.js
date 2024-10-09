import { useRouter } from "next/router";
import StartGameForm from "./StartGameForm";
import { Game } from '../components/gameclasses';

export default function Play() {
    const router = useRouter();

    const handleFormSubmit = (playerNames, numVampires, numDoctor, numNeutral, numSheriff, numScout, numHunter) => {
        const game = new Game(playerNames, numVampires, numDoctor, numNeutral, numSheriff, numScout, numHunter);
        const playersWithRoles = game.players;

        router.push({
            pathname: '/reveal',
            query: { players: JSON.stringify(playersWithRoles) }
        });
    };

    return (
        <div className='flex min-h-screen bodyBackground flex-col justify-center items-center bg-gray-800'>
            <StartGameForm onStartGame={handleFormSubmit} />
        </div>
    );
}
