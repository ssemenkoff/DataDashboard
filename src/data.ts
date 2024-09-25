import type { App } from "vue";
import DatasourceRepository from './plugins/data/DatasourceRepository'
import ConnectionRepository from './plugins/data/ConnectionRepository';
import RestConnection from './plugins/data/connections/RestConnection';
import CsvConnection from './plugins/data/connections/CsvConnection';
import RestStore from '@/plugins/data/stores/REST/RestStore';
import CsvStore from '@/plugins/data/stores/CSV/CsvStore';
import DataTableComposer from './plugins/data/composers/DataTable/DataTableComposer'
import DataTableComposerSettings from './plugins/data/composers/DataTable/DataTableComposerSettings.vue'
import RestStoreSettings from './plugins/data/stores/REST/RestStoreSettings.vue'
import CsvStoreSettings from './plugins/data/stores/CSV/CsvStoreSettings.vue'
import CsvPreview from "@/components/previews/CsvPreview.vue";
import RestPreview from "@/components/previews/RestPreview.vue";
import XmlaPreview from "@/components/previews/XmlaPreview.vue";
import DataTablePreview from "@/components/previews/DataTablePreview.vue";


export function initData(app: App) {
  const availableConnections = {
      REST: RestConnection,
      CSV: CsvConnection,
  }
  const connectionRepository = new ConnectionRepository(availableConnections);
  app.config.globalProperties.connectionRepository = connectionRepository;
  app.config.globalProperties.connectionsConfig = {
      availableConnections
  };
  
  const availableDatasources = {
      REST: RestStore,
      CSV: CsvStore,
      "DataTable Composer": DataTableComposer,
  };
  const datasourcesVisualConfig = {
      "DataTable Composer": DataTableComposerSettings,
      REST: RestStoreSettings,
      CSV: CsvStoreSettings,
  }
  const datasourcesPreviewConfig = {
      "DataTable Composer": DataTablePreview,
      REST: RestPreview,
      CSV: CsvPreview,
      XMLA: XmlaPreview,
  }

  const datasourceRepository = new DatasourceRepository(availableDatasources);
  app.config.globalProperties.datasourceRepository = datasourceRepository;
  app.config.globalProperties.datasourceConfig = {
      availableDatasources,
      settingsComponents: datasourcesVisualConfig,
      previewComponents: datasourcesPreviewConfig
  };
  
  (RestStore.prototype as any).connectionRepository = connectionRepository;
  (CsvStore.prototype as any).connectionRepository = connectionRepository;
  (DataTableComposer.prototype as any).connectionRepository = connectionRepository;
  
  (RestStore.prototype as any).datasourceRepository = datasourceRepository;
  (CsvStore.prototype as any).datasourceRepository = datasourceRepository;
  (DataTableComposer.prototype as any).datasourceRepository = datasourceRepository;

  return {
    datasourceRepository
  }
}