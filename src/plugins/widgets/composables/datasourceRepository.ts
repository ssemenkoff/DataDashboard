import { getCurrentInstance, onMounted, type Ref } from 'vue';
import { watch, ref } from 'vue';

export function useDatasourceRepository(storeName: Ref<string>) {
  const instance = getCurrentInstance();
  const datasourceRepository: IDatasourceRepository = (instance?.appContext.config as any).datasourceRepository;

  const data = ref(null);

  const getData = () => {
    const store = datasourceRepository.getStore(storeName.value);
    data.value = store.getData();
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