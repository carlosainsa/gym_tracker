import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exerciseService } from '../services/exerciseService';
import { Exercise } from '../types/models';

export const useExercise = () => {
  const queryClient = useQueryClient();
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);

  const { data: exercises, isLoading, error } = useQuery({
    queryKey: ['exercises', selectedMuscleGroup],
    queryFn: () => selectedMuscleGroup 
      ? exerciseService.getExercisesByMuscleGroup(selectedMuscleGroup)
      : exerciseService.getExercises(),
  });

  const addExerciseMutation = useMutation({
    mutationFn: (newExercise: Omit<Exercise, 'id'>) => 
      exerciseService.addExercise(newExercise),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });

  const updateExerciseMutation = useMutation({
    mutationFn: ({ id, exercise }: { id: string; exercise: Partial<Exercise> }) =>
      exerciseService.updateExercise(id, exercise),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });

  const filterByMuscleGroup = useCallback((muscleGroup: string | null) => {
    setSelectedMuscleGroup(muscleGroup);
  }, []);

  return {
    exercises,
    isLoading,
    error,
    addExercise: addExerciseMutation.mutate,
    updateExercise: updateExerciseMutation.mutate,
    filterByMuscleGroup,
    selectedMuscleGroup,
  };
};