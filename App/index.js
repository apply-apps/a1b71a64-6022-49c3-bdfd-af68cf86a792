// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, ScrollView, Button, View, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';

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
        <View style={styles.planContainer}>
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
                const response = await axios.get('http://apihub.p.appply.xyz:3300/chatgpt', {
                    messages: [
                        { role: "system", content: "You are a helpful assistant. Please provide the workout history." },
                        { role: "user", content: "Show me my workout history." }
                    ],
                    model: "gpt-4o"
                });
                setHistory(response.data.response);
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

export default function App() {
    const [currentScreen, setCurrentScreen] = useState('home');

    const navigateTo = (screen) => {
        setCurrentScreen(screen);
    };

    return (
        <SafeAreaView style={styles.appContainer}>
            <Text style={styles.title}>Workout Tracker App</Text>
            <Button title="Weekly Workout Plan" onPress={() => navigateTo('plan')} />
            <Button title="Workout History" onPress={() => navigateTo('history')} />
            <ScrollView>
                {currentScreen === 'plan' && <WeeklyWorkoutPlan />}
                {currentScreen === 'history' && <WorkoutHistory />}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    appContainer: {
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
    planContainer: {
        padding: 10,
        backgroundColor: '#F5F5F5',
    },
    historyContainer: {
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
    historyItem: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        marginVertical: 5,
    },
});