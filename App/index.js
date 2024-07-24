// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, ScrollView, Button, View, TextInput, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WeeklyWorkoutPlan = () => {
    const [workoutPlan, setWorkoutPlan] = useState([]);
    const [exercise, setExercise] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');

    const addExercise = () => {
        setWorkoutPlan([...workoutPlan, { exercise, sets, reps }]);
        setExercise('');
        setSets('');
        setReps('');
    };

    return (
        <View style={planStyles.container}>
            <Text style={planStyles.header}>Weekly Workout Plan</Text>
            <TextInput
                style={planStyles.input}
                placeholder="Exercise"
                value={exercise}
                onChangeText={setExercise}
            />
            <TextInput
                style={planStyles.input}
                placeholder="Sets"
                value={sets}
                onChangeText={setSets}
                keyboardType="numeric"
            />
            <TextInput
                style={planStyles.input}
                placeholder="Reps"
                value={reps}
                onChangeText={setReps}
                keyboardType="numeric"
            />
            <Button title="Add Exercise" onPress={addExercise} />
            {workoutPlan.map((item, index) => (
                <View key={index} style={planStyles.planItem}>
                    <Text>{item.exercise} - {item.sets} sets of {item.reps} reps</Text>
                </View>
            ))}
        </View>
    );
};

const planStyles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#F5F5F5',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
    },
    planItem: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        marginVertical: 5,
    },
});

const WorkoutHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const savedHistory = await AsyncStorage.getItem('workoutHistory');
            if (savedHistory !== null) {
                setHistory(JSON.parse(savedHistory));
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching workout history: ", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={historyStyles.container}>
            <Text style={historyStyles.header}>Workout History</Text>
            {history.map((workout, index) => (
                <View key={index} style={historyStyles.historyItem}>
                    <Text>{workout}</Text>
                </View>
            ))}
        </View>
    );
};

const historyStyles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#F5F5F5',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    historyItem: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        marginVertical: 5,
    },
});

const CurrentWorkout = () => {
    const [currentWorkout, setCurrentWorkout] = useState([]);
    const [workoutActive, setWorkoutActive] = useState(false);

    const startWorkout = () => {
        setWorkoutActive(true);
        setCurrentWorkout([]);
    };

    const endWorkout = async () => {
        setWorkoutActive(false);
        const savedHistory = await AsyncStorage.getItem('workoutHistory');
        const history = savedHistory ? JSON.parse(savedHistory) : [];
        history.push(currentWorkout);
        await AsyncStorage.setItem('workoutHistory', JSON.stringify(history));
        setCurrentWorkout([]);
    };

    const addCompletedExercise = (exercise) => {
        setCurrentWorkout([...currentWorkout, exercise]);
    };

    return (
        <View style={currentWorkoutStyles.container}>
            <Text style={currentWorkoutStyles.header}>Current Workout</Text>
            {!workoutActive ? (
                <Button title="Start Workout" onPress={startWorkout} />
            ) : (
                <>
                    <Button title="End Workout" onPress={endWorkout} />
                    <CompletedExerciseForm onSave={addCompletedExercise} />
                    {currentWorkout.map((item, index) => (
                        <View key={index} style={currentWorkoutStyles.workoutItem}>
                            <Text>{item}</Text>
                        </View>
                    ))}
                </>
            )}
        </View>
    );
};

const CompletedExerciseForm = ({ onSave }) => {
    const [exercise, setExercise] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');

    const handleSave = () => {
        if (exercise && sets && reps) {
            onSave(`${exercise} - ${sets} sets of ${reps} reps`);
            setExercise('');
            setSets('');
            setReps('');
        }
    };

    return (
        <View style={currentWorkoutStyles.form}>
            <TextInput
                style={currentWorkoutStyles.input}
                placeholder="Exercise"
                value={exercise}
                onChangeText={setExercise}
            />
            <TextInput
                style={currentWorkoutStyles.input}
                placeholder="Sets"
                value={sets}
                onChangeText={setSets}
                keyboardType="numeric"
            />
            <TextInput
                style={currentWorkoutStyles.input}
                placeholder="Reps"
                value={reps}
                onChangeText={setReps}
                keyboardType="numeric"
            />
            <Button title="Add Exercise" onPress={handleSave} />
        </View>
    );
};

const currentWorkoutStyles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#F5F5F5',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    form: {
        marginBottom: 20,
    },
    input: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
    },
    workoutItem: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        marginVertical: 5,
    },
});

export default function App() {
    const [currentScreen, setCurrentScreen] = useState('home');

    const navigateTo = (screen) => {
        setCurrentScreen(screen);
    };

    return (
        <SafeAreaView style={appStyles.container}>
            <Text style={appStyles.title}>Workout Tracker App</Text>
            <Button title="Weekly Workout Plan" onPress={() => navigateTo('plan')} />
            <Button title="Workout History" onPress={() => navigateTo('history')} />
            <Button title="Current Workout" onPress={() => navigateTo('currentWorkout')} />
            <ScrollView>
                {currentScreen === 'plan' && <WeeklyWorkoutPlan />}
                {currentScreen === 'history' && <WorkoutHistory />}
                {currentScreen === 'currentWorkout' && <CurrentWorkout />}
            </ScrollView>
        </SafeAreaView>
    );
}

const appStyles = StyleSheet.create({
    container: {
        paddingTop: 20,
        padding: 10,
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
});