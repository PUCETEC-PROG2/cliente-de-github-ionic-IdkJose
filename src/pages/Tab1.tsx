import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  IonAlert,
  IonModal,
  IonButton,
  IonInput,
  IonTextarea,
} from "@ionic/react";
import { IonList } from "@ionic/react";
import "./Tab1.css";
import RepoItem from "../components/RepoItem";
import React from "react";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { fetchRepositories, deleteRepository, updateRepository } from "../services/GithubService";

const Tab1: React.FC = () => {
  const [repos, setRepos] = React.useState<RepositoryItem[]>([]);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedRepo, setSelectedRepo] = React.useState<RepositoryItem | null>(null);
  const [editName, setEditName] = React.useState("");
  const [editDescription, setEditDescription] = React.useState("");

  const loadRepos = async () => {
    const reposData = await fetchRepositories();
    setRepos(reposData);
  };

  useIonViewDidEnter(() => {
    console.log("******* Leyendo repositorios ... *******");
    loadRepos();
  });

  const handleDelete = (repo: RepositoryItem) => {
    setSelectedRepo(repo);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (selectedRepo && selectedRepo.owner) {
      const success = await deleteRepository(selectedRepo.owner, selectedRepo.name);
      if (success) {
        setShowDeleteAlert(false);
        setSelectedRepo(null);
        // Esperar a que GitHub procese la eliminación
        setTimeout(() => {
          loadRepos();
        }, 2000);
      }
    }
  };

  const handleEdit = (repo: RepositoryItem) => {
    setSelectedRepo(repo);
    setEditName(repo.name); //Hace q se edite el nombre del repo
    setEditDescription(repo.description || "");
    setShowEditModal(true);
  };

  const confirmEdit = async () => {
    if (selectedRepo && selectedRepo.owner) {
      const success = await updateRepository(selectedRepo.owner, selectedRepo.name, editName, editDescription);
      if (success) {
        setShowEditModal(false);
        setSelectedRepo(null);
        setEditName("");
        setEditDescription("");
        // Esperar a que GitHub procese la actualización
        setTimeout(() => {
          loadRepos();
        }, 2000);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {repos.map((repo, index) => (
            <RepoItem
              key={index}
              name={repo.name}
              description={repo.description}
              imageUrl={repo.imageUrl}
              owner={repo.owner}
              language={repo.language}
              onDelete={() => handleDelete(repo)}
              onEdit={() => handleEdit(repo)}
            />
          ))}
        </IonList>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Confirmar eliminación"
          message={`¿Estás seguro de que quieres eliminar el repositorio "${selectedRepo?.name}"?`}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
            },
            {
              text: "Eliminar",
              role: "confirm",
              handler: confirmDelete,
            },
          ]}
        />

        <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Editar Repositorio</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonInput
              label="Nombre"
              labelPlacement="floating"
              fill="outline"
              placeholder="Nombre del repositorio"
              value={editName}
              onIonChange={(e) => setEditName(e.detail.value || "")}
            ></IonInput>
            <IonTextarea
              label="Descripción"
              labelPlacement="floating"
              fill="outline"
              placeholder="Descripción del repositorio"
              rows={6}
              style={{ marginTop: "20px" }}
              value={editDescription}
              onIonChange={(e) => setEditDescription(e.detail.value || "")}
            ></IonTextarea>
            <div style={{ marginTop: "20px" }}>
              <IonButton expand="block" onClick={confirmEdit}>
                Guardar
              </IonButton>
              <IonButton expand="block" fill="outline" onClick={() => setShowEditModal(false)}>
                Cancelar
              </IonButton>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;