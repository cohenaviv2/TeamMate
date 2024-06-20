import React from "react";
import { FlatList, ListRenderItem } from "react-native";
import styles from "./List.scss";

interface ScrollableListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
}

const ScrollableList = <T extends unknown>({ data, renderItem, keyExtractor }: ScrollableListProps<T>) => {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContainer} // Optional: Add your own styling here
    />
  );
};

export default ScrollableList;
