package doantotnghiep.example.DoAnTotNghiep.Service.specs;

import doantotnghiep.example.DoAnTotNghiep.DTO.ComponentDTO.*;
import doantotnghiep.example.DoAnTotNghiep.DTO.ProductDTO;
import doantotnghiep.example.DoAnTotNghiep.Entity.Components.*;
import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import doantotnghiep.example.DoAnTotNghiep.Repository.Specs.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductSpecServiceImpl implements ProductSpecService {

    @Autowired
    private CpuRepository cpuRepository;

    @Autowired
    private GpuRepository gpuRepository;

    @Autowired
    private MotherboardRepository motherboardRepository;

    @Autowired
    private RamRepository ramRepository;

    @Autowired
    private SsdRepository ssdRepository;

    @Autowired
    private HddRepository hddRepository;

    @Autowired
    private PsuRepository psuRepository;

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private CoolerRepository coolerRepository;

    @Autowired
    private MonitorRepository monitorRepository;

    @Autowired
    private KeyboardRepository keyboardRepository;

    @Autowired
    private MouseRepository mouseRepository;

    @Autowired
    private HeadsetRepository headsetRepository;

    @Autowired
    private SpeakerRepository speakerRepository;

    @Override
    public void saveOrUpdateSpecs(Products product, ProductDTO dto) {
        if (product == null || product.getId() == null)
            return;
        String productType = product.getProductType();

        if ("COMPONENT".equalsIgnoreCase(productType)) {
            saveOrUpdateComponentSpecs(product, dto);
        } else if ("ACCESSORY".equalsIgnoreCase(productType)) {
            saveOrUpdateAccessorySpecs(product, dto);
        }
    }

    private void saveOrUpdateComponentSpecs(Products product, ProductDTO dto) {
        String compType = product.getComponentType();
        if (compType == null)
            return;

        switch (compType.toUpperCase()) {
            case "CPU":
                if (dto.getCpuSpecs() != null) {
                    Cpu cpu = cpuRepository.findById(product.getId()).orElse(new Cpu());
                    cpu.setProduct(product);
                    cpu.setSocket(dto.getCpuSpecs().getSocket());
                    cpu.setCores(dto.getCpuSpecs().getCores());
                    cpu.setThreads(dto.getCpuSpecs().getThreads());
                    cpu.setBaseClock(dto.getCpuSpecs().getBaseClock());
                    cpu.setBoostClock(dto.getCpuSpecs().getBoostClock());
                    cpu.setCacheMb(dto.getCpuSpecs().getCacheMb());
                    cpu.setIntegratedGraphics(dto.getCpuSpecs().getIntegratedGraphics());
                    cpuRepository.save(cpu);
                }
                break;

            case "GPU":
                if (dto.getGpuSpecs() != null) {
                    Gpu gpu = gpuRepository.findById(product.getId()).orElse(new Gpu());
                    gpu.setProduct(product);
                    gpu.setChipSet(dto.getGpuSpecs().getChipSet());
                    gpu.setVramGb(dto.getGpuSpecs().getVramGb());
                    gpu.setMemoryType(dto.getGpuSpecs().getMemoryType());
                    gpu.setLengthMm(dto.getGpuSpecs().getLengthMm());
                    gpu.setWidthSlots(dto.getGpuSpecs().getWidthSlots());
                    gpu.setRecommendedPsuWatt(dto.getGpuSpecs().getRecommendedPsuWatt());
                    gpu.setPowerConnector(dto.getGpuSpecs().getPowerConnector());
                    gpuRepository.save(gpu);
                }
                break;

            case "MAINBOARD":
                if (dto.getMotherboardSpecs() != null) {
                    Motherboard mb = motherboardRepository.findById(product.getId()).orElse(new Motherboard());
                    mb.setProduct(product);
                    mb.setSocket(dto.getMotherboardSpecs().getSocket());
                    mb.setChipset(dto.getMotherboardSpecs().getChipset());
                    mb.setMemoryType(dto.getMotherboardSpecs().getMemoryType());
                    mb.setMaxRamGb(dto.getMotherboardSpecs().getMaxRamGb());
                    mb.setRamSlots(dto.getMotherboardSpecs().getRamSlots());
                    mb.setFormFactor(dto.getMotherboardSpecs().getFormFactor());
                    mb.setM2Slots(dto.getMotherboardSpecs().getM2Slots());
                    mb.setSataPorts(dto.getMotherboardSpecs().getSataPorts());
                    mb.setWifi(dto.getMotherboardSpecs().getWifi());
                    mb.setBluetooth(dto.getMotherboardSpecs().getBluetooth());
                    motherboardRepository.save(mb);
                }
                break;

            case "RAM":
                if (dto.getRamSpecs() != null) {
                    Ram ram = ramRepository.findById(product.getId()).orElse(new Ram());
                    ram.setProduct(product);
                    ram.setCapacityGb(dto.getRamSpecs().getCapacityGb());
                    ram.setMemoryType(dto.getRamSpecs().getMemoryType());
                    ram.setSpeedMhz(dto.getRamSpecs().getSpeedMhz());
                    ram.setModuleCount(dto.getRamSpecs().getModuleCount());
                    ram.setVoltage(dto.getRamSpecs().getVoltage());
                    ramRepository.save(ram);
                }
                break;

            case "SSD":
                if (dto.getSsdSpecs() != null) {
                    Ssd ssd = ssdRepository.findById(product.getId()).orElse(new Ssd());
                    ssd.setProduct(product);
                    ssd.setCapacityGb(dto.getSsdSpecs().getCapacityGb());
                    ssd.setInterfaceType(dto.getSsdSpecs().getInterfaceType());
                    ssd.setFormFactor(dto.getSsdSpecs().getFormFactor());
                    ssd.setReadSpeedMb(dto.getSsdSpecs().getReadSpeedMb());
                    ssd.setWriteSpeedMb(dto.getSsdSpecs().getWriteSpeedMb());
                    ssd.setNandType(dto.getSsdSpecs().getNandType());
                    ssdRepository.save(ssd);
                }
                break;

            case "HDD":
                if (dto.getHddSpecs() != null) {
                    Hdd hdd = hddRepository.findById(product.getId()).orElse(new Hdd());
                    hdd.setProduct(product);
                    hdd.setCapacityGb(dto.getHddSpecs().getCapacityGb());
                    hdd.setRpm(dto.getHddSpecs().getRpm());
                    hdd.setCacheMb(dto.getHddSpecs().getCacheMb());
                    hdd.setInterfaceType(dto.getHddSpecs().getInterfaceType());
                    hddRepository.save(hdd);
                }
                break;

            case "PSU":
                if (dto.getPsuSpecs() != null) {
                    Psu psu = psuRepository.findById(product.getId()).orElse(new Psu());
                    psu.setProduct(product);
                    psu.setWattage(dto.getPsuSpecs().getWattage());
                    psu.setEfficiencyRating(dto.getPsuSpecs().getEfficiencyRating());
                    psu.setModularType(dto.getPsuSpecs().getModularType());
                    psu.setFormFactor(dto.getPsuSpecs().getFormFactor());
                    psuRepository.save(psu);
                }
                break;

            case "CASE":
                if (dto.getCaseSpecs() != null) {
                    Case c = caseRepository.findById(product.getId()).orElse(new Case());
                    c.setProduct(product);
                    c.setFormFactorSupport(dto.getCaseSpecs().getFormFactorSupport());
                    c.setMaxGpuLengthMm(dto.getCaseSpecs().getMaxGpuLengthMm());
                    c.setMaxCpuCoolerHeightMm(dto.getCaseSpecs().getMaxCpuCoolerHeightMm());
                    c.setMaxRadiatorSizeMm(dto.getCaseSpecs().getMaxRadiatorSizeMm());
                    c.setDriveBays(dto.getCaseSpecs().getDriveBays());
                    caseRepository.save(c);
                }
                break;

            case "COOLER":
                if (dto.getCoolerSpecs() != null) {
                    Cooler cl = coolerRepository.findById(product.getId()).orElse(new Cooler());
                    cl.setProduct(product);
                    cl.setCoolerType(dto.getCoolerSpecs().getCoolerType());
                    cl.setSupportedSockets(dto.getCoolerSpecs().getSupportedSockets());
                    cl.setRadiatorSizeMm(dto.getCoolerSpecs().getRadiatorSizeMm());
                    cl.setFanSizeMm(dto.getCoolerSpecs().getFanSizeMm());
                    cl.setHeightMm(dto.getCoolerSpecs().getHeightMm());
                    cl.setTdpSupport(dto.getCoolerSpecs().getTdpSupport());
                    coolerRepository.save(cl);
                }
                break;
        }
    }

    private void saveOrUpdateAccessorySpecs(Products product, ProductDTO dto) {
        String accType = dto.getAccessoryType();

        // Kiểm tra loại phụ kiện theo accessoryType hoặc theo việc DTO tương ứng khác
        // null
        if ("MONITOR".equalsIgnoreCase(accType) || dto.getMonitorSpecs() != null) {
            if (dto.getMonitorSpecs() != null) {
                Monitor m = monitorRepository.findById(product.getId()).orElse(new Monitor());
                m.setProduct(product);
                m.setScreenSizeInch(dto.getMonitorSpecs().getScreenSizeInch());
                m.setResolution(dto.getMonitorSpecs().getResolution());
                m.setRefreshRateHz(dto.getMonitorSpecs().getRefreshRateHz());
                m.setPanelType(dto.getMonitorSpecs().getPanelType());
                m.setResponseTimeMs(dto.getMonitorSpecs().getResponseTimeMs());
                m.setBrightnessNits(dto.getMonitorSpecs().getBrightnessNits());
                m.setAspectRatio(dto.getMonitorSpecs().getAspectRatio());
                m.setAdaptiveSync(dto.getMonitorSpecs().getAdaptiveSync());
                m.setPorts(dto.getMonitorSpecs().getPorts());
                monitorRepository.save(m);
            }
        } else if ("KEYBOARD".equalsIgnoreCase(accType) || dto.getKeyboardSpecs() != null) {
            if (dto.getKeyboardSpecs() != null) {
                Keyboard kb = keyboardRepository.findById(product.getId()).orElse(new Keyboard());
                kb.setProduct(product);
                kb.setKeyboardType(dto.getKeyboardSpecs().getKeyboardType());
                kb.setSwitchType(dto.getKeyboardSpecs().getSwitchType());
                kb.setLayout(dto.getKeyboardSpecs().getLayout());
                kb.setConnection(dto.getKeyboardSpecs().getConnection());
                kb.setKeycapMaterial(dto.getKeyboardSpecs().getKeycapMaterial());
                kb.setBacklight(dto.getKeyboardSpecs().getBacklight());
                kb.setRgb(dto.getKeyboardSpecs().getRgb());
                kb.setPollingRateHz(dto.getKeyboardSpecs().getPollingRateHz());
                kb.setBatteryMah(dto.getKeyboardSpecs().getBatteryMah());
                kb.setDimensions(dto.getKeyboardSpecs().getDimensions());
                keyboardRepository.save(kb);
            }
        } else if ("MOUSE".equalsIgnoreCase(accType) || dto.getMouseSpecs() != null) {
            if (dto.getMouseSpecs() != null) {
                Mouse mouse = mouseRepository.findById(product.getId()).orElse(new Mouse());
                mouse.setProduct(product);
                mouse.setSensor(dto.getMouseSpecs().getSensor());
                mouse.setDpiMax(dto.getMouseSpecs().getDpiMax());
                mouse.setPollingRateHz(dto.getMouseSpecs().getPollingRateHz());
                mouse.setButtons(dto.getMouseSpecs().getButtons());
                mouse.setConnection(dto.getMouseSpecs().getConnection());
                mouse.setWeightG(dto.getMouseSpecs().getWeightG());
                mouse.setBatteryMah(dto.getMouseSpecs().getBatteryMah());
                mouse.setRgb(dto.getMouseSpecs().getRgb());
                mouseRepository.save(mouse);
            }
        } else if ("HEADSET".equalsIgnoreCase(accType) || dto.getHeadsetSpecs() != null) {
            if (dto.getHeadsetSpecs() != null) {
                Headset hs = headsetRepository.findById(product.getId()).orElse(new Headset());
                hs.setProduct(product);
                hs.setHeadsetType(dto.getHeadsetSpecs().getHeadsetType());
                hs.setDriverSizeMm(dto.getHeadsetSpecs().getDriverSizeMm());
                hs.setConnection(dto.getHeadsetSpecs().getConnection());
                hs.setImpedanceOhm(dto.getHeadsetSpecs().getImpedanceOhm());
                hs.setFrequencyResponse(dto.getHeadsetSpecs().getFrequencyResponse());
                hs.setMicrophone(dto.getHeadsetSpecs().getMicrophone());
                hs.setNoiseCancellation(dto.getHeadsetSpecs().getNoiseCancellation());
                hs.setSurroundSound(dto.getHeadsetSpecs().getSurroundSound());
                hs.setBatteryMah(dto.getHeadsetSpecs().getBatteryMah());
                headsetRepository.save(hs);
            }
        } else if ("SPEAKER".equalsIgnoreCase(accType) || dto.getSpeakerSpecs() != null) {
            if (dto.getSpeakerSpecs() != null) {
                Speaker sp = speakerRepository.findById(product.getId()).orElse(new Speaker());
                sp.setProduct(product);
                sp.setSpeakerType(dto.getSpeakerSpecs().getSpeakerType());
                sp.setChannels(dto.getSpeakerSpecs().getChannels());
                sp.setPowerWatt(dto.getSpeakerSpecs().getPowerWatt());
                sp.setFrequencyResponse(dto.getSpeakerSpecs().getFrequencyResponse());
                sp.setImpedanceOhm(dto.getSpeakerSpecs().getImpedanceOhm());
                sp.setConnection(dto.getSpeakerSpecs().getConnection());
                sp.setBluetoothVersion(dto.getSpeakerSpecs().getBluetoothVersion());
                sp.setRgb(dto.getSpeakerSpecs().getRgb());
                speakerRepository.save(sp);
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public void loadSpecsForProduct(Products product, ProductDTO dto) {
        if (product == null || product.getId() == null || dto == null)
            return;
        String productType = product.getProductType();

        if ("COMPONENT".equalsIgnoreCase(productType)) {
            loadComponentSpecs(product.getId(), product.getComponentType(), dto);
        } else if ("ACCESSORY".equalsIgnoreCase(productType)) {
            loadAccessorySpecs(product.getId(), dto);
        }
    }

    private void loadComponentSpecs(Long productId, String compType, ProductDTO dto) {
        if (compType == null)
            return;

        switch (compType.toUpperCase()) {
            case "CPU":
                cpuRepository.findById(productId).ifPresent(c -> {
                    CpuDTO d = new CpuDTO(c.getProductId(), c.getSocket(), c.getCores(), c.getThreads(),
                            c.getBaseClock(), c.getBoostClock(), c.getCacheMb(), c.getIntegratedGraphics());
                    dto.setCpuSpecs(d);
                    dto.setSpecData(d);
                });
                break;

            case "GPU":
                gpuRepository.findById(productId).ifPresent(g -> {
                    GpuDTO d = new GpuDTO(g.getProductId(), g.getChipSet(), g.getVramGb(), g.getMemoryType(),
                            g.getLengthMm(), g.getWidthSlots(), g.getRecommendedPsuWatt(), g.getPowerConnector());
                    dto.setGpuSpecs(d);
                    dto.setSpecData(d);
                });
                break;

            case "MAINBOARD":
                motherboardRepository.findById(productId).ifPresent(m -> {
                    MotherBoardDTO d = new MotherBoardDTO(m.getProductId(), m.getSocket(), m.getChipset(),
                            m.getMemoryType(), m.getMaxRamGb(), m.getRamSlots(), m.getFormFactor(),
                            m.getM2Slots(), m.getSataPorts(), m.getWifi(), m.getBluetooth());
                    dto.setMotherboardSpecs(d);
                    dto.setSpecData(d);
                });
                break;

            case "RAM":
                ramRepository.findById(productId).ifPresent(r -> {
                    RamDTO d = new RamDTO(r.getProductId(), r.getCapacityGb(), r.getMemoryType(),
                            r.getSpeedMhz(), r.getModuleCount(), r.getVoltage());
                    dto.setRamSpecs(d);
                    dto.setSpecData(d);
                });
                break;

            case "SSD":
                ssdRepository.findById(productId).ifPresent(s -> {
                    SsdDTO d = new SsdDTO(s.getProductId(), s.getCapacityGb(), s.getInterfaceType(),
                            s.getFormFactor(), s.getReadSpeedMb(), s.getWriteSpeedMb(), s.getNandType());
                    dto.setSsdSpecs(d);
                    dto.setSpecData(d);
                });
                break;

            case "HDD":
                hddRepository.findById(productId).ifPresent(h -> {
                    HddDTO d = new HddDTO(h.getProductId(), h.getCapacityGb(), h.getRpm(), h.getCacheMb(),
                            h.getInterfaceType());
                    dto.setHddSpecs(d);
                    dto.setSpecData(d);
                });
                break;

            case "PSU":
                psuRepository.findById(productId).ifPresent(p -> {
                    PsuDTO d = new PsuDTO(p.getProductId(), p.getWattage(), p.getEfficiencyRating(), p.getModularType(),
                            p.getFormFactor());
                    dto.setPsuSpecs(d);
                    dto.setSpecData(d);
                });
                break;

            case "CASE":
                caseRepository.findById(productId).ifPresent(c -> {
                    CaseDTO d = new CaseDTO(c.getProductId(), c.getFormFactorSupport(), c.getMaxGpuLengthMm(),
                            c.getMaxCpuCoolerHeightMm(), c.getMaxRadiatorSizeMm(), c.getDriveBays());
                    dto.setCaseSpecs(d);
                    dto.setSpecData(d);
                });
                break;

            case "COOLER":
                coolerRepository.findById(productId).ifPresent(c -> {
                    CoolerDTO d = new CoolerDTO(c.getProductId(), c.getCoolerType(), c.getSupportedSockets(),
                            c.getRadiatorSizeMm(), c.getFanSizeMm(), c.getHeightMm(), c.getTdpSupport());
                    dto.setCoolerSpecs(d);
                    dto.setSpecData(d);
                });
                break;
        }
    }

    private void loadAccessorySpecs(Long productId, ProductDTO dto) {
        monitorRepository.findById(productId).ifPresent(m -> {
            MonitorDTO d = new MonitorDTO(m.getProductId(), m.getScreenSizeInch(), m.getResolution(),
                    m.getRefreshRateHz(), m.getPanelType(), m.getResponseTimeMs(), m.getBrightnessNits(),
                    m.getAspectRatio(), m.getAdaptiveSync(), m.getPorts());
            dto.setAccessoryType("MONITOR");
            dto.setMonitorSpecs(d);
            dto.setSpecData(d);
        });

        keyboardRepository.findById(productId).ifPresent(k -> {
            KeyBoardDTO d = new KeyBoardDTO(k.getProductId(), k.getKeyboardType(), k.getSwitchType(),
                    k.getLayout(), k.getConnection(), k.getKeycapMaterial(), k.getBacklight(),
                    k.getRgb(), k.getPollingRateHz(), k.getBatteryMah(), k.getDimensions());
            dto.setAccessoryType("KEYBOARD");
            dto.setKeyboardSpecs(d);
            dto.setSpecData(d);
        });

        mouseRepository.findById(productId).ifPresent(m -> {
            MouseDTO d = new MouseDTO(m.getProductId(), m.getSensor(), m.getDpiMax(),
                    m.getPollingRateHz(), m.getButtons(), m.getConnection(), m.getWeightG(),
                    m.getBatteryMah(), m.getRgb());
            dto.setAccessoryType("MOUSE");
            dto.setMouseSpecs(d);
            dto.setSpecData(d);
        });

        headsetRepository.findById(productId).ifPresent(h -> {
            HeadsetDTO d = new HeadsetDTO(h.getProductId(), h.getHeadsetType(), h.getDriverSizeMm(),
                    h.getConnection(), h.getImpedanceOhm(), h.getFrequencyResponse(), h.getMicrophone(),
                    h.getNoiseCancellation(), h.getSurroundSound(), h.getBatteryMah());
            dto.setAccessoryType("HEADSET");
            dto.setHeadsetSpecs(d);
            dto.setSpecData(d);
        });

        speakerRepository.findById(productId).ifPresent(s -> {
            SpeakerDTO d = new SpeakerDTO(s.getProductId(), s.getSpeakerType(), s.getChannels(),
                    s.getPowerWatt(), s.getFrequencyResponse(), s.getImpedanceOhm(), s.getConnection(),
                    s.getBluetoothVersion(), s.getRgb());
            dto.setAccessoryType("SPEAKER");
            dto.setSpeakerSpecs(d);
            dto.setSpecData(d);
        });
    }

    @Override
    public void deleteSpecsForProduct(Long productId) {
        if (productId == null)
            return;
        cpuRepository.deleteById(productId);
        gpuRepository.deleteById(productId);
        motherboardRepository.deleteById(productId);
        ramRepository.deleteById(productId);
        ssdRepository.deleteById(productId);
        hddRepository.deleteById(productId);
        psuRepository.deleteById(productId);
        caseRepository.deleteById(productId);
        coolerRepository.deleteById(productId);
        monitorRepository.deleteById(productId);
        keyboardRepository.deleteById(productId);
        mouseRepository.deleteById(productId);
        headsetRepository.deleteById(productId);
        speakerRepository.deleteById(productId);
    }
}
