import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

/**
 * Supported query operators
 */
export type WhereOperator =
  | '<'
  | '<='
  | '=='
  | '!='
  | '>='
  | '>'
  | 'array-contains'
  | 'array-contains-any'
  | 'in'
  | 'not-in';

export interface QueryFilter {
  fieldPath: string | FirebaseFirestoreTypes.FieldPath; // supports nested fields: "user.profile.age"
  opStr: WhereOperator;
  value: any;
}

/**
 * Base Firestore Repository
 * T = document type
 */
export abstract class FirestoreBaseRepository<T extends object> {
  protected collectionRef: FirebaseFirestoreTypes.CollectionReference<T>;

  constructor(collectionName: string) {
    this.collectionRef = firestore().collection(
      collectionName,
    ) as FirebaseFirestoreTypes.CollectionReference<T>;
  }

  /**
   * Create document with auto-generated ID
   */
  async create(data: T): Promise<string> {
    const docRef = await this.collectionRef.add({
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
    } as T);

    return docRef.id;
  }

  /**
   * Create or overwrite document with specific ID
   */
  async set(
    id: string,
    data: FirebaseFirestoreTypes.SetValue<T>,
  ): Promise<void> {
    await this.collectionRef.doc(id).set(
      {
        ...data,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  }

  /**
   * Update existing document
   */

  /**
   * Delete document
   */
  async delete(id: string): Promise<void> {
    await this.collectionRef.doc(id).delete();
  }

  /**
   * Get document by ID
   */
  async getById(id: string): Promise<T | null> {
    const snapshot = await this.collectionRef.doc(id).get();
    return snapshot.exists() ? (snapshot.data() as T) : null;
  }

  /**
   * Query with filters (supports nested fields)
   */
  async query(filters: QueryFilter[]): Promise<(T & { id: string })[]> {
    let query: FirebaseFirestoreTypes.Query<T> = this.collectionRef;

    for (const filter of filters) {
      query = query.where(filter.fieldPath as any, filter.opStr, filter.value);
    }

    const snapshot = await query.get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as T),
    }));
  }

  /**
   * Get all documents
   */
  async getAll(): Promise<(T & { id: string })[]> {
    const snapshot = await this.collectionRef.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as T),
    }));
  }
}
