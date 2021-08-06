import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Image, TouchableOpacity, Text } from "react-native";

const DoneButton = ({ ...props }) => {
  return (
    <TouchableOpacity
      {...props}
      style={{ alignSelf: "auto", marginRight: 10 }}
      transparent
    >
      <Text style={{ color: "black" }}>Done</Text>
    </TouchableOpacity>
  );
};
const NextButton = ({ ...props }) => {
  return (
    <TouchableOpacity
      {...props}
      style={{ alignSelf: "auto", marginRight: 10 }}
      transparent
    >
      <Text style={{ color: "black" }}>Next</Text>
    </TouchableOpacity>
  );
};
const SkipButton = ({ ...props }) => {
  return (
    <TouchableOpacity
      {...props}
      style={{ alignSelf: "auto", marginLeft: 10 }}
      transparent
    >
      <Text style={{ color: "black" }}>Skip</Text>
    </TouchableOpacity>
  );
};

const GettingStarted = ({ navigation }) => {
  return (
    <Onboarding
      titleStyles={{ color: "black" }}
      DoneButtonComponent={DoneButton}
      SkipButtonComponent={SkipButton}
      NextButtonComponent={NextButton}
      onDone={() => navigation.navigate("Login")}
      onSkip={() => navigation.navigate("Login")}
      pages={[
        {
          backgroundColor: "#fff",
          image: <Image />,
          title: "Onboarding",
          subtitle: "Welcome to RESCU \nan app for all your emergency services",
        },
        {
          backgroundColor: "#fff",
          image: <Image /*source={require('./images/circle.png')} */ />,
          title: "Onboarding",
          subtitle: "Done with React Native Onboarding Swiper",
        },
        {
          backgroundColor: "#fff",
          image: <Image /*source={require('./images/circle.png')} */ />,
          title: "Onboarding",
          subtitle: "Done with React Native Onboarding Swiper",
        },
      ]}
    />
  );
};

export default GettingStarted;
