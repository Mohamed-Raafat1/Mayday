//REACT NATIVE

import React, { useLayoutEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Title, Drawer } from "react-native-paper";
import firebase from "firebase";

import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/actions/index";

export function DrawerContent(props) {
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(fetchUser());
  }, []);

  const onSignout = () => {
    firebase.auth().signOut();
  };
  const currentUser = useSelector((state) => state.userState.currentUser);
  if (currentUser == undefined) return <View></View>;
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Avatar.Image
                source={{
                  uri: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
                }}
                size={50}
              />
              <View style={{ marginLeft: 15, flexDirection: "column" }}>
                <Title style={styles.title}>
                  {currentUser.FirstName + " " + currentUser.LastName}
                </Title>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  name="home-outline"
                  size={25}
                  color="black"
                />
              )}
              label="Home"
              onPress={() => {
                props.navigation.navigate("Home");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  name="account-outline"
                  size={25}
                  color="black"
                />
              )}
              label="Medical ID"
              onPress={() => {
                props.navigation.navigate("Medical ID");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  name="contacts-outline"
                  size={25}
                  color="black"
                />
              )}
              label="Emergency Contacts"
              onPress={() => {
                props.navigation.navigate("Emergency Contacts");
              }}
            />

            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  name="hospital-box-outline"
                  color={"black"}
                  size={size}
                />
              )}
              label="Nearby Hospitals"
              onPress={() => {
                props.navigation.navigate("View Nearest Hospital");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialIcons name="star-rate" size={24} color="black" />
              )}
              label="User Rating"
              onPress={() => {
                props.navigation.navigate("User Rating");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  name="history"
                  size={25}
                  color="black"
                />
              )}
              label="Previous Accidents"
              onPress={() => {
                props.navigation.navigate("Accidents List");
              }}
            />

            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  name="cog-outline"
                  size={25}
                  color="black"
                />
              )}
              label="Settings"
              onPress={() => {
                props.navigation.navigate("Settings");
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="account-check-outline"
              color={"black"}
              size={size}
            />
          )}
          label="Support"
          //   onPress={() => {
          // props.navigation.navigate("SupportScreen");
          //   }}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="exit-to-app"
              color={"black"}
              size={25}
            />
          )}
          label="Sign Out"
          onPress={onSignout}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="exit-to-app"
              color={"black"}
              size={25}
            />
          )}
          label="bagarab"
          onPress={() => {
            console.log(currentUser);
          }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
