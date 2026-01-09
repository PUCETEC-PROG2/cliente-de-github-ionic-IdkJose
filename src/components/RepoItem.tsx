import './RepoItem.css';
import React from 'react';
import {
  IonItem,
  IonLabel,
  IonThumbnail,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { trash, create } from 'ionicons/icons';
import { RepositoryItem } from '../interfaces/RepositoryItem';

interface RepoItemProps extends RepositoryItem {
  onDelete?: () => void;
  onEdit?: () => void;
}

const RepoItem: React.FC<RepoItemProps> = ({ name, description, imageUrl, owner, language, onDelete, onEdit }) => {
  return (
    <IonItem>
        <IonThumbnail slot="start">
            <img alt="Silhouette of mountains" src={imageUrl || "https://ionicframework.com/docs/img/demos/thumbnail.svg"} />
        </IonThumbnail>
        <IonLabel>
          <h2>{name}</h2>
          <p>{description}</p>
          <p>Propietario: {owner}</p>
          <p>Lenguaje: {language}</p>
        </IonLabel>
        <IonButton slot="end" fill="clear" color="primary" onClick={onEdit}>
          <IonIcon icon={create} />
        </IonButton>
        <IonButton slot="end" fill="clear" color="danger" onClick={onDelete}>
          <IonIcon icon={trash} />
        </IonButton>
    </IonItem>
  );
};

export default RepoItem;