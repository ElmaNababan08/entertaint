import {
  Col,
  Row,
  Typography,
  Card,
  List,
  Input,
  FloatButton,
  Button,
  notification,
  Form,
  Drawer,
  Popconfirm
} from "antd";
import { useState, useEffect } from "react";
import { getData, sendData, deleteData } from "../../utils/api"; // Pastikan fungsi ini sesuai dengan API Anda
import { PlusCircleOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Movies = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isDrawer, setIsDrawer] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [idSelected, setIdSelected] = useState(null);

  useEffect(() => {
    getDataMovies();
  }, []);

  const getDataMovies = () => {
    getData("/api/playlist") // Ganti dengan endpoint yang sesuai untuk mendapatkan semua film
      .then((resp) => {
        if (resp) {
          setDataSource(resp);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const showAlert = (status, title, description) => {
    api[status]({
      message: title,
      description: description,
    });
  };

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const handleDrawer = () => {
    setIsDrawer(true);
  };

  const onCloseDrawer = () => {
    if (isEdit) {
      form.resetFields();
      setIsEdit(false);
      setIdSelected(null);
    }
    setIsDrawer(false);
  };

  const handleSubmit = () => {
    const playName = form.getFieldValue("play_name");
    const playUrl = form.getFieldValue("play_url");
    const playThumbnail = form.getFieldValue("play_thumbnail");
    const playGenre = form.getFieldValue("play_genre");
    const playDescription = form.getFieldValue("play_description");

    if (!playName || !playUrl || !playThumbnail || !playGenre || !playDescription) {
      showAlert("error", "Incomplete Data", "Please fill in all required fields");
      return;
    }

    let formData = new FormData();
    formData.append("play_name", playName);
    formData.append("play_url", playUrl);
    formData.append("play_thumbnail", playThumbnail);
    formData.append("play_genre", playGenre);
    formData.append("play_description", playDescription);

    const url = isEdit ? `/api/playlist/update/${idSelected}` : "/api/playlist"; // Ganti dengan endpoint yang sesuai
    sendData(url, formData)
      .then((resp) => {
        if (resp?.datas) {
          showAlert("success", "Data Sent", "Data berhasil tersimpan");
          form.resetFields();
          getDataMovies();
          onCloseDrawer();
        } else {
          showAlert("error", "Submission Failed", "Data tidak berhasil dikirim");
        }
      })
      .catch((err) => {
        console.error(err);
        showAlert("error", "Submission Failed", "Data tidak berhasil dikirim");
      });
  };

  const renderDrawer = () => {
    return (
      <Drawer
        title={isEdit ? "Edit Movie" : "Add Movie"}
        onClose={onCloseDrawer}
        open={isDrawer}
        extra={<Button type="primary" onClick={() => handleSubmit()}>Submit</Button>}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Play Name" name="play_name" required>
            <Input />
          </Form.Item>
          <Form.Item label="Play URL" name="play_url" required>
            <Input />
          </Form.Item>
          <Form.Item label="Play Thumbnail" name="play_thumbnail" required>
            <Input />
          </Form.Item>
          <Form.Item label="Play Genre" name="play_genre" required>
            <Input />
          </Form.Item>
          <Form.Item label="Play Description" name="play_description" required>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Drawer>
    );
  };

  const handleDrawerEdit = (record) => {
    setIsDrawer(true);
    setIsEdit(true);
    setIdSelected(record?.id);
    form.setFieldsValue({
      play_name: record?.play_name,
      play_url: record?.play_url,
      play_thumbnail: record?.play_thumbnail,
      play_genre: record?.play_genre,
      play_description: record?.play_description,
    });
  };

  const confirmDelete = (record_id) => {
    const url = `/api/playlist/${record_id}`; // Ganti dengan endpoint yang sesuai untuk menghapus film
    deleteData(url)
      .then((resp) => {
        if (resp?.status === 200) {
          showAlert("success", "Data deleted", "Data berhasil terhapus");
          getDataMovies();
          form.resetFields();
          onCloseDrawer();
        } else {
          showAlert("error", "Deletion Failed", "Data tidak berhasil dihapus");
        }
      })
      .catch((err) => {
        console.error(err);
        showAlert("error", "Deletion Failed", "Data tidak berhasil dihapus");
      });
  };

  return (
    <>
      {contextHolder}
      <Title level={2}>Movies</Title>
      <Input
        placeholder="Search Movies"
        prefix={<SearchOutlined />}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <FloatButton
        icon={<PlusCircleOutlined />}
        onClick={handleDrawer}
      />
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={dataSource.filter(item => item.play_name.toLowerCase().includes(searchText))}
        renderItem={item => (
          <List.Item>
            <Card
              title={item.play_name}
              extra={
                <>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => handleDrawerEdit(item)}
                  />
                  <Popconfirm
                    title="Are you sure to delete this movie?"
                    onConfirm={() => confirmDelete(item.id)}
                  >
                    <Button icon={<DeleteOutlined />} />
                  </Popconfirm>
                </>
              }
            >
              <Text>{item.play_description}</Text>
            </Card>
          </List.Item>
        )}
      />
      {renderDrawer()}
    </>
  );
};

export default Movies;