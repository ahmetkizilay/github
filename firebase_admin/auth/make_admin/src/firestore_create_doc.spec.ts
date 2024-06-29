import { App, deleteApp, initializeApp} from 'firebase-admin/app';

import { getFirestore} from 'firebase-admin/firestore';
import { CreateDocumentParams, createDocument } from './firestore_create_doc';

process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';

const PROJECT_ID = 'webtrax-1fc7d';

describe('firestore_create_doc', () => {
  let app: App
  let firestore: FirebaseFirestore.Firestore;

  beforeAll(() => {
    app = initializeApp({
      projectId: PROJECT_ID,
    });

    firestore = getFirestore();
  });

  afterAll(async () => {
    await deleteApp(app);
  });

  beforeEach(async () => {
    const colRef = firestore.collection('samples');
    let docs = await colRef.listDocuments();
    for (const doc of docs) {
      await doc.delete();
    }
  })

  it('creates a sample doc', async () => {
    const docParams: CreateDocumentParams = {
      collection: `samples`,
      data: {
        name: 'sample',
        value: 42,
      },
    };
    const docRefId = await createDocument(firestore, docParams);

    const docRef = firestore.collection('samples').doc(docRefId);
    const doc = await docRef.get();
    expect(doc.data()).toEqual(docParams.data);
  });
});
