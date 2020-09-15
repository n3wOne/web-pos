import * as React from "react";
import { connectToStore } from "../../store/ConnectHolder";

class EditStorageDataModal extends React.Component {
  constructor(props) {
    super();
    this.state = {
      editItem: props.cart.editItem || {
        id: "",
        name: "",
        price: "",
        description: "",
        imgUrl: null,
      },
    };
  }

  handleChange = (name) => {
    return (event) => {
      const value = event.nativeEvent.div;
      const newValue =
        name === "price" || name === "id" ? parseFloat(value) : value;
      this.setState({
        editItem: { ...this.state.editItem, [name]: newValue },
      });
    };
  };

  // createTwoButtonAlert = () =>
  //   Alert.alert(
  //     "Удаление",
  //     `Удалить элемент: ${this.state.editItem.name}?`,
  //     [
  //       {
  //         div: "Отмена",
  //         onClick: () => {},
  //         style: "cancel"
  //       },
  //       {
  //         div: "OK",
  //         onClick: () => {
  //           this.props.removeItem(this.state.editItem);
  //           this.props.hideEditModal();
  //         },
  //       },
  //     ],
  //     { cancelable: false }
  //   );

  renderChildren = (editItem) => {
    // const {editItem} = this.state;
    // if (!editItem) {
    //   return <div>No data</div>;
    // }
    const { name = "", id = "", description = "", price = "", imgUrl = null } =
      editItem || {};
    return (
      <div
        key={`render-children - ${id}`}
        style={{
          flex: 1,
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div key={`name-${name}`} style={styles.item}>
          <div style={styles.div}>{"Название"}</div>
          <input
            onChange={this.handleChange("name")}
            style={styles.input}
            defaultValue={name}
          />
        </div>
        <div key={`description-${description}`} style={styles.item}>
          <div style={styles.div}>{"Описание"}</div>
          <input
            onChange={this.handleChange("description")}
            style={styles.input}
            defaultValue={description}
          />
        </div>
        <div key={`price-${price}`} style={styles.item}>
          <div style={styles.div}>{"Стоимость"}</div>
          <input
            onChange={this.handleChange("price")}
            style={styles.input}
            defaultValue={`${price}`}
          />
        </div>
        <div key={`id-${id}`} style={styles.item}>
          <div style={styles.div}>{"Идентификатор"}</div>
          <input
            onChange={this.handleChange("id")}
            style={styles.input}
            defaultValue={`${id}`}
          />
        </div>
      </div>
    );
  };

  render() {
    const { item, hideEditModal, cart, saveEdit, removeItem } = this.props;
    const { showModal, editItem } = cart;
    return (
      <div animationType="slide" transparent={true} visible={showModal}>
        <div style={styles.centereddiv}>
          <div style={[styles.modaldiv, { flexDirection: "column" }]}>
            <div style={{ flex: 1 }}>{this.renderChildren(editItem)}</div>
            <div style={styles.buttonsWrapper}>
              <div
                style={[styles.button, styles.closeButton]}
                onClick={() => hideEditModal()}
              >
                <div style={styles.buttondiv}>Закрыть</div>
              </div>
              <div
                style={[styles.button, styles.saveButton]}
                onClick={() => {
                  saveEdit(this.state.editItem);
                  hideEditModal();
                }}
              >
                <div style={styles.buttondiv}>Сохранить</div>
              </div>
            </div>
            <button
              title={"УДАЛИТЬ"}
              onClick={() => this.createTwoButtonAlert()}
            />
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    marginVertical: 20,
  },
  buttonsWrapper: {
    flexDirection: "row",
    // flex: 1,
    // justifyContent: 'flex-start',
    // alignItems: 'stretch',
    // alignContent: 'stretch',
    // flexWrap: 'nowrap',
    // flexDirection: 'row',
  },
  buttondiv: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    // width: 300,
    flex: 1,
    margin: 15,
  },
  saveButton: {
    backgroundColor: "rgb(87,255,146)",
  },
  closeButton: {
    backgroundColor: "rgb(255,93,64)",
  },
  centereddiv: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modaldiv: {
    margin: 20,
    width: "100%",
    maxHeight: "100%",
    backgroundColor: "white",
    padding: 10,
  },
  div: {
    flex: 1,
  },
  input: {
    flex: 1,
    flexGrow: 2,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    divAlign: "center",
    // height: 20,
    padding: 0,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: 'flex-start',
    flex: 1,
    margin: 5,
  },
  itemInvisible: {
    backgroundColor: "transparent",
  },
};

export default connectToStore(EditStorageDataModal);
