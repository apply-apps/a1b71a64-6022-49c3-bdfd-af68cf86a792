// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, ScrollView, Button, View, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';

const App = () => {
    const [currentScreen, setCurrentScreen] = useState('home');

    const navigateTo = (screen) => {
        setCurrentScreen(screen);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Workout Tracker App</Text>
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
};

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
        <View style={styles.weeklyContainer}>
            <Text style={styles.header}>Weekly Workout Plan</Text>
            <TextInput
                style={styles.input}
                placeholder="Exercise"
                value={exercise}
                onChangeText={setExercise}
            />
            <TextInput
                style={styles.input}
                placeholder="Sets"
                value={sets}
                onChangeText={setSets}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Reps"
                value={reps}
                onChangeText={setReps}
                keyboardType="numeric"
            />
            <Button title="Add Exercise" onPress={addExercise} />
            {workoutPlan.map((item, index) => (
                <View key={index} style={styles.planItem}>
                    <Text>{item.exercise} - {item.sets} sets of {item.reps} reps</Text>
                </View>
            ))}
        </View>
    );
};

const WorkoutHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.post('http://apihub.p.appply.xyz:3300/chatgpt', {
                    messages: [
                        { role: "system", content: "You are a helpful assistant. Please provide the workout history." },
                        { role: "user", content: "Show me my workout history." }
                    ],
                    model: "gpt-4o"
                });
                setHistory(response.data.response.split('\n'));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching workout history: ", error);
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.historyContainer}>
            <Text style={styles.header}>Workout History</Text>
            {history.map((workout, index) => (
                <View key={index} style={styles.historyItem}>
                    <Text>{workout}</Text>
                </View>
            ))}
        </View>
    );
};

const CurrentWorkout = () => {
    const [currentWorkout, setCurrentWorkout] = useState([]);
    const [workoutActive, setWorkoutActive] = useState(false);

    const startWorkout = () => {
        setWorkoutActive(true);
        setCurrentWorkout([]);
    };

    const endWorkout = () => {
        setWorkoutActive(false);
        // Save the workout to history if needed
    };

    const addCompletedExercise = (exercise) => {
        setCurrentWorkout([...currentWorkout, exercise]);
    };

    return (
        <View style={styles.currentContainer}>
            <Text style={styles.header}>Current Workout</Text>
            {!workoutActive ? (
                <Button title="Start Workout" onPress={startWorkout} />
            ) : (
                <>
                    <Button title="End Workout" onPress={endWorkout} />
                    <CompletedExerciseForm onSave={addCompletedExercise} />
                    {currentWorkout.map((item, index) => (
                        <View key={index} style={styles.workoutItem}>
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
        <View style={styles.form}>
            <TextInput
                style={styles.input}
                placeholder="Exercise"
                value={exercise}
                onChangeText={setExercise}
            />
            <TextInput
                style={styles.input}
                placeholder="Sets"
                value={sets}
                onChangeText={setSets}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Reps"
                value={reps}
                onChangeText={setReps}
                keyboardType="numeric"
            />
            <Button title="Add Exercise" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
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
    weeklyContainer: {
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
    historyContainer: {
        padding: 10,
        backgroundColor: '#F5F5F5',
    },
    historyItem: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        marginVertical: 5,
    },
    currentContainer: {
        padding: 10,
        backgroundColor: '#F5F5F5',
    },
    form: {
        marginBottom: 20,
    },
    workoutItem: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        marginVertical: 5,
    },
});

export default App;