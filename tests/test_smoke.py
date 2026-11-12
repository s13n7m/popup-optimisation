from src import config


def test_config_scale_is_positive():
    assert config.N_VENUES > 0 and config.N_MARKETS > 0
