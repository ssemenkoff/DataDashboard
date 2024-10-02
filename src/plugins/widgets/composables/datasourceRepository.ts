import { getCurrentInstance, onMounted, type Ref } from 'vue';
import { watch, ref } from 'vue';

export function useDatasourceRepository(storeName: Ref<string>) {
  const instance = getCurrentInstance();
  const datasourceRepository: IDatasourceRepository = (instance?.appContext.config as any).datasourceRepository;

  const data = ref(null as unknown as any);

  const getData = () => {
    const datasource = datasourceRepository.getDatasource(storeName.value);
    data.value = datasource.getData();
  }

  watch(() => storeName.value, () => {
    getData();
  });
  
  
  onMounted(() => {
    getData();
  });

  return {
    data
  }
}