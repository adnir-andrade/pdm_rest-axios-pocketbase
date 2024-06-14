import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button, TextInput } from "react-native";
import * as Speech from "expo-speech";
import { Picker } from "@react-native-picker/picker";

export default function App() {
  const [textToSpeech, setTextToSpeech] = useState<string>("Pablito");
  const [language, setlanguage] = useState<string>("pt");

  const languageTag: [string, string][] = [
    ["Afrikaans", "af"],
    ["Albanian", "sq"],
    ["Amharic", "am"],
    ["Arabic", "ar"],
    ["Armenian", "hy"],
    ["Azerbaijani", "az"],
    ["Basque", "eu"],
    ["Belarusian", "be"],
    ["Bengali", "bn"],
    ["Bosnian", "bs"],
    ["Bulgarian", "bg"],
    ["Burmese", "my"],
    ["Catalan", "ca"],
    ["Chinese", "zh"],
    ["Croatian", "hr"],
    ["Czech", "cs"],
    ["Danish", "da"],
    ["Dutch", "nl"],
    ["English", "en"],
    ["Estonian", "et"],
    ["Filipino", "fil"],
    ["Finnish", "fi"],
    ["French", "fr"],
    ["Galician", "gl"],
    ["Georgian", "ka"],
    ["German", "de"],
    ["Greek", "el"],
    ["Gujarati", "gu"],
    ["Haitian Creole", "ht"],
    ["Hebrew", "he"],
    ["Hindi", "hi"],
    ["Hungarian", "hu"],
    ["Icelandic", "is"],
    ["Indonesian", "id"],
    ["Irish", "ga"],
    ["Italian", "it"],
    ["Japanese", "ja"],
    ["Kannada", "kn"],
    ["Kazakh", "kk"],
    ["Khmer", "km"],
    ["Korean", "ko"],
    ["Lao", "lo"],
    ["Latvian", "lv"],
    ["Lithuanian", "lt"],
    ["Macedonian", "mk"],
    ["Malay", "ms"],
    ["Malayalam", "ml"],
    ["Maltese", "mt"],
    ["Marathi", "mr"],
    ["Mongolian", "mn"],
    ["Nepali", "ne"],
    ["Norwegian", "no"],
    ["Oriya", "or"],
    ["Persian", "fa"],
    ["Polish", "pl"],
    ["Portuguese", "pt"],
    ["Punjabi", "pa"],
    ["Romanian", "ro"],
    ["Russian", "ru"],
    ["Serbian", "sr"],
    ["Sinhala", "si"],
    ["Slovak", "sk"],
    ["Slovenian", "sl"],
    ["Spanish", "es"],
    ["Swahili", "sw"],
    ["Swedish", "sv"],
    ["Tamil", "ta"],
    ["Telugu", "te"],
    ["Thai", "th"],
    ["Turkish", "tr"],
    ["Ukrainian", "uk"],
    ["Urdu", "ur"],
    ["Uzbek", "uz"],
    ["Vietnamese", "vi"],
    ["Welsh", "cy"],
    ["Xhosa", "xh"],
    ["Zulu", "zu"],
  ];

  const speak = () => {
    Speech.speak(textToSpeech, {
      language: language,
      pitch: 2,
      rate: 1,
    });
  };

  const handleInput = () => {
    setTextToSpeech(textToSpeech);
  };

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="Insert what you want to hear"
        onChangeText={setTextToSpeech}
      />
      <Picker
        selectedValue={language}
        onValueChange={(itemValue) => setlanguage(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a language" value="" />
        {languageTag.map((language) => (
          <Picker.Item
            key={language[0]}
            label={language[0]}
            value={language[1]}
          />
        ))}
      </Picker>
      <View style={styles.container}>
        <Button title="Press to hear some words" onPress={speak} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  picker: {
    height: 30,
    width: "100%",
    marginBottom: 175,
  },
});
