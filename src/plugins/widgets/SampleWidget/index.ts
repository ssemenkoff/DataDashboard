import DatasourceRepository from '@/plugins/data/DatasourceRepository';
import SampleWidget from './SampleWidget.vue';

const SampleWidgetPlugin = (datasourceRepository: DatasourceRepository) => ({
    install(app: any) {
        const component = app.component('SampleWidget', SampleWidget);
        component.config.datasourceRepository = datasourceRepository;
    }
});

export default SampleWidgetPlugin;