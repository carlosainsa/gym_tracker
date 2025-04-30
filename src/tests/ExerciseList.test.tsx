import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ExerciseList } from '../components/ExerciseList';
import { exerciseService } from '../services/exerciseService';

// Mock del servicio
jest.mock('../services/exerciseService');

const mockExercises = [
  {
    id: '1',
    name: 'Press de Banca',
    description: 'Ejercicio para pecho',
    muscleGroups: ['Pecho', 'Tríceps'],
    difficulty: 'Intermedio',
  },
  {
    id: '2',
    name: 'Dominadas',
    description: 'Ejercicio para espalda',
    muscleGroups: ['Espalda', 'Bíceps'],
    difficulty: 'Avanzado',
  },
];

describe('ExerciseList', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    exerciseService.getExercises.mockResolvedValue(mockExercises);
  });

  it('renderiza la lista de ejercicios correctamente', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ExerciseList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Press de Banca')).toBeInTheDocument();
      expect(screen.getByText('Dominadas')).toBeInTheDocument();
    });
  });

  it('filtra ejercicios por término de búsqueda', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ExerciseList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Press de Banca')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Buscar ejercicios...');
    fireEvent.change(searchInput, { target: { value: 'press' } });

    expect(screen.getByText('Press de Banca')).toBeInTheDocument();
    expect(screen.queryByText('Dominadas')).not.toBeInTheDocument();
  });

  it('filtra ejercicios por grupo muscular', async () => {
    exerciseService.getExercisesByMuscleGroup.mockResolvedValue([mockExercises[0]]);

    render(
      <QueryClientProvider client={queryClient}>
        <ExerciseList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Press de Banca')).toBeInTheDocument();
    });

    const filterButton = screen.getByRole('button', { name: 'Pecho' });
    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(screen.getByText('Press de Banca')).toBeInTheDocument();
      expect(screen.queryByText('Dominadas')).not.toBeInTheDocument();
    });
  });
});